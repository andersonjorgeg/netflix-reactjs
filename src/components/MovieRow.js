import React, { useState, useRef, useEffect } from 'react';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// Componente que exibe uma linha horizontal de filmes/séries
// Recebe props: title (título da categoria) e items (lista de filmes/séries)
function MovieRow({title, items}){
  // Refs para o container e a lista
  const rowRef = useRef(null);
  const listRef = useRef(null);
  
  // Estados para controlar a navegação
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Verifica se há itens para exibir
  const hasItems = items.results?.length > 0;

  // Atualiza o estado de mobile quando a janela é redimensionada
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Função para navegar para a esquerda
  const handleLeftScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = scrollLeft - (clientWidth * 0.75);
      
      rowRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  // Função para navegar para a direita
  const handleRightScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = scrollLeft + (clientWidth * 0.75);
      
      rowRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  // Atualiza a visibilidade das setas com base na posição do scroll
  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      
      // Mostra a seta esquerda apenas se não estiver no início
      setShowLeftArrow(scrollLeft > 10);
      
      // Mostra a seta direita apenas se não estiver no final
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Configura o evento de scroll
  useEffect(() => {
    const rowElement = rowRef.current;
    if (rowElement) {
      rowElement.addEventListener('scroll', handleScroll);
      // Verifica inicialmente se deve mostrar a seta direita
      handleScroll();
      
      return () => rowElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="relative mb-6 mt-12 group">
      {/* Título da categoria - responsivo para diferentes tamanhos de tela */}
      <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 pl-4 md:pl-8 text-white">{title}</h2>

      {/* Botões de navegação - visíveis com base no estado de scroll */}
      {hasItems && !isMobile && (
        <>
          {/* Botão de navegação para a esquerda */}
          {showLeftArrow && (
            <div 
              className="absolute left-0 top-[58%] transform -translate-y-1/2 bg-black/50 rounded-r-lg cursor-pointer z-10 
                        flex items-center justify-center h-[calc(100%-2rem)] max-h-[225px] w-10 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={handleLeftScroll}
              aria-label="Rolar para a esquerda"
            >
              <NavigateBeforeIcon className="text-white" style={{fontSize: 40}} />
            </div>
          )}
          
          {/* Botão de navegação para a direita */}
          {showRightArrow && (
            <div 
              className="absolute right-0 top-[58%] transform -translate-y-1/2 bg-black/50 rounded-l-lg cursor-pointer z-10 
                        flex items-center justify-center h-[calc(100%-2rem)] max-h-[225px] w-10 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={handleRightScroll}
              aria-label="Rolar para a direita"
            >
              <NavigateNextIcon className="text-white" style={{fontSize: 40}} />
            </div>
          )}
        </>
      )}

      {/* Área que contém a lista de filmes/séries - usando scroll nativo */}
      <div 
        ref={rowRef}
        className="overflow-x-auto overflow-y-hidden pl-4 md:pl-8 pr-4 md:pr-8 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Lista de filmes/séries */}
        <div 
          ref={listRef}
          className="flex gap-2 md:gap-4"
        >
          {/* Mapeia cada item para um elemento visual */}
          {hasItems && items.results.map((item, index) => (
            <div 
              key={index} 
              className="flex-none w-[140px] md:w-[150px] h-[210px] cursor-pointer 
                        transform hover:scale-105 transition-transform duration-200"
            >
              {/* Imagem do poster do filme/série */}
              {item.poster_path ? (
                <img 
                  className="w-full h-full rounded-sm md:rounded object-cover"
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`} 
                  alt={item.original_title || item.name || 'Movie poster'} 
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 rounded-sm md:rounded flex items-center justify-center">
                  <span className="text-gray-400 text-sm text-center px-2">
                    {item.original_title || item.name || 'No image available'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Adicione esta classe ao seu arquivo global.css ou tailwind.config.js
// .scrollbar-hide::-webkit-scrollbar { display: none; }

export default MovieRow;