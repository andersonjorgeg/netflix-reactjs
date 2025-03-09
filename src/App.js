import React, { useEffect, useState } from 'react';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie'
import Header from './components/Header';

function App(){
  // Estados da aplicação
  const [movieList, setMovieList] = useState([]); // Lista de categorias de filmes/séries
  const [featuredData, setFeaturedData] = useState(null); // Dados do filme em destaque
  const [blackHeader, setBlackHeader] = useState(false); // Controla se o header deve ter fundo preto
  const [isLoading, setIsLoading] = useState(true); // Controla a exibição da tela de carregamento

  // Hook que executa quando o componente é montado
  useEffect(() => {
    const loadAll = async () => {
      // Carrega a lista completa de filmes/séries por categoria
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      // Seleciona um filme aleatório da categoria "originals" para ser o destaque
      let originals = list.filter((item) => item.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen]
      
      // Busca informações detalhadas sobre o filme escolhido
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);
      
      // Desativa a tela de carregamento quando os dados estiverem prontos
      setIsLoading(false);
    }

    loadAll();
  }, []) // Array vazio significa que este efeito só executa uma vez, na montagem do componente

  // Hook para detectar o scroll da página e mudar a aparência do header
  useEffect(() => {
    const scrollListener = () => {
      // Se o scroll for maior que 20px, o header fica com fundo preto
      if(window.scrollY > 20) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    };

    // Adiciona o listener de scroll quando o componente monta
    window.addEventListener('scroll', scrollListener);
    
    // Remove o listener quando o componente desmonta (cleanup function)
    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, []);

  return (
    <div className="bg-[#111] text-white min-h-screen">
      {/* Cabeçalho da aplicação - recebe a prop que controla sua transparência */}
      <Header black={blackHeader} />

      {/* Exibe o filme em destaque apenas quando os dados estiverem carregados */}
      {featuredData &&
        <FeaturedMovie item={featuredData} />
      }

      {/* Seção que contém todas as listas de filmes/séries */}
      {/* Posicionada com margem negativa para sobrepor parte do filme em destaque */}
      <section className="mt-[-120px] relative z-10">
        {/* Mapeia cada categoria para um componente MovieRow */}
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      {/* Rodapé da aplicação */}
      <footer className="mt-12 py-8 text-center text-gray-400 text-sm">
        Feito com <span role="img" aria-label="coração" className="text-red-500">❤️</span> por Anderson Jorge através do curso da B7web<br/>
        Direitos de imagem para Netflix<br/>
        Dados pego do site Themoviedb.org
      </footer>

      {/* Tela de carregamento - exibida apenas enquanto os dados estão sendo carregados */}
      {isLoading && 
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-black flex items-center justify-center z-50">
          <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="Loading..." className="max-w-full max-h-full" />
      </div>
      }
    </div>
  );
}

export default App;
