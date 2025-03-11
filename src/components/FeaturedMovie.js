import React from 'react';

// Componente que exibe o filme/série em destaque no topo da página
// Recebe um objeto 'item' com informações do filme/série
const FeaturedMovie = ({ item }) => {
  // Extrai a data de lançamento e converte para um objeto Date
  const firstDate = new Date(item.first_air_date);
  
  // Extrai os gêneros do filme/série.
  const genres = item.genres ? item.genres.map(genre => genre.name) : [];

  // Função pura para truncar texto sem cortar palavras
  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    
    const truncated = text.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    return lastSpaceIndex > 0 
      ? truncated.substring(0, lastSpaceIndex) + " ..."
      : truncated + " ...";
  };

  // Aplica a função de truncamento à descrição
  const description = truncateText(item.overview, 100);
  console.log(item.overview);

  return (
    // Seção principal com imagem de fundo do filme/série
    <section className="relative h-[70vh] md:h-[80vh] lg:h-[90vh] bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url(https://image.tmdb.org/t/p/original${item.backdrop_path})`,
      backgroundPosition: 'center top'
    }}>
      {/* Gradiente vertical para melhorar a legibilidade do texto sobre a imagem */}
      <div className="w-full h-full bg-gradient-to-t from-black via-black/50 to-transparent">
        {/* Gradiente horizontal para melhorar a legibilidade do texto sobre a imagem */}
        <div className="w-full h-full bg-gradient-to-r from-black/90 md:from-black/70 to-transparent flex flex-col justify-end p-4 md:p-8 lg:p-12">
          {/* Nome do filme/série */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">{item.name}</h1>
          
          {/* Bloco de informações adicionais */}
          <div className="flex flex-wrap gap-3 mb-3 text-sm md:text-base text-white">
            {/* Pontuação média de avaliação - verde se >= 7, vermelho se < 7 */}
            <div className={`font-bold ${item.vote_average >= 7 ? 'text-green-500' : 'text-red-500'}`}>
              {item.vote_average.toFixed(1)} Pontos
            </div>
            {/* Ano de lançamento */}
            <div>{firstDate.getFullYear()}</div>
            {/* Número de temporadas (com tratamento para plural) */}
            <div>
              {item.number_of_seasons} Temporada{item.number_of_seasons !== 1 ? 's' : ''}
            </div>
          </div>
          
          {/* Descrição/sinopse do filme/série */}
          <div className="text-sm md:text-base text-gray-200 mb-4 max-w-xl">{description}</div>
          
          {/* Botões de ação */}
          <div className="flex flex-wrap gap-3 mb-4">
            {/* Botão para assistir (link para página de reprodução) */}
            <a href={`/watch/${item.id}`} className="bg-white text-black py-2 px-4 rounded font-bold hover:bg-opacity-80 transition-all flex items-center">
              <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Assistir
            </a>
            {/* Botão para adicionar à lista pessoal */}
            <a href={`/list/${item.id}`} className="bg-gray-600 text-white py-2 px-4 rounded font-bold hover:bg-gray-700 transition-all flex items-center">
              <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Minha Lista
            </a>
          </div>
          
          {/* Lista de gêneros do filme/série */}
          <div className="text-sm mb-[5rem] md:text-base text-gray-300">
            <strong>Gêneros:</strong> {genres.join(', ')}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMovie;