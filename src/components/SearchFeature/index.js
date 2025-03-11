import React, { useState, useEffect, useRef } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close'; // Ícone X para limpar a busca
import { API_CONFIG } from '../../utils/api';

/**
 * Componente SearchFeature - Implementa uma barra de busca para filmes, séries e atores
 * Características:
 * - Botão de busca que expande para mostrar um campo de input
 * - Resultados em tempo real enquanto o usuário digita
 * - Suporte para busca de filmes, séries e pessoas
 * - Interface responsiva que se adapta a diferentes tamanhos de tela
 */
const SearchFeature = () => {
  // Estados do componente
  const [isOpen, setIsOpen] = useState(false);         // Controla se a barra de busca está aberta ou fechada
  const [searchTerm, setSearchTerm] = useState('');    // Armazena o texto digitado pelo usuário
  const [searchResults, setSearchResults] = useState([]);  // Armazena os resultados da busca
  const [isLoading, setIsLoading] = useState(false);   // Indica se está carregando resultados
  const searchRef = useRef(null);                      // Referência para o elemento DOM da barra de busca (usado para detectar cliques fora)

  /**
   * Função assíncrona que busca resultados na API do TMDB
   * @param {string} query - Termo de busca digitado pelo usuário
   */
  const fetchSearchResults = async (query) => {
    // Se a query estiver vazia, limpa os resultados e retorna sem fazer nada
    if (!query || query.trim() === '') {
      setSearchResults([]);
      return;
    }

    // Ativa o indicador de carregamento
    setIsLoading(true);
    try {
      // Usa a variável de ambiente para a chave da API
      /* const API_KEY = process.env.REACT_APP_TMDB_API_KEY; */
      const API_KEY = API_CONFIG.API_KEY;
      const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
      
      // Endpoint 'multi' busca filmes, séries e pessoas ao mesmo tempo
      const response = await fetch(
        `${BASE_URL}/search/multi?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=1&include_adult=false`
      );
      const data = await response.json();
      
      // Filtragem dos resultados para melhorar a qualidade da exibição:
      // 1. Mantém apenas filmes, séries e pessoas
      // 2. Mantém apenas itens que tenham imagens
      // 3. Limita a 6 resultados para não sobrecarregar a interface
      const filteredResults = data.results
        .filter(item => 
          (item.media_type === 'movie' || item.media_type === 'tv' || item.media_type === 'person') && 
          (item.poster_path || item.profile_path || item.backdrop_path)
        )
        .slice(0, 6); 
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Erro ao buscar resultados:', error);
      setSearchResults([]);
    } finally {
      // Desativa o indicador de carregamento independente do resultado
      setIsLoading(false);
    }
  };

  /**
   * Effect Hook para detectar cliques fora do componente de busca
   * Quando o usuário clica fora da barra de busca, ela é fechada automaticamente
   */
  useEffect(() => {
    // Função que verifica se o clique foi fora do componente
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false); // Fecha a barra de busca
      }
    };

    // Adiciona o event listener quando o componente monta
    document.addEventListener('mousedown', handleClickOutside);
    
    // Remove o event listener quando o componente desmonta (cleanup)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * Effect Hook para implementar debounce na busca
   * Evita fazer requisições a cada tecla digitada, aguardando um breve período
   * de inatividade antes de buscar
   */
  useEffect(() => {
    // Configura um timer que dispara a busca após 500ms de inatividade
    const delayDebounce = setTimeout(() => {
      fetchSearchResults(searchTerm);
    }, 500); // 500ms de delay é um bom equilíbrio entre responsividade e performance

    // Limpa o timer anterior se o usuário continuar digitando
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]); // Executa sempre que searchTerm mudar

  /**
   * Função para alternar a visibilidade da barra de busca
   * Controla a abertura/fechamento e gerencia o foco no input
   */
  const toggleSearch = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Quando abrir, foca no input para facilitar a digitação imediata
      setTimeout(() => {
        const input = searchRef.current?.querySelector('input');
        if (input) input.focus();
      }, 100); // Pequeno delay para garantir que o DOM foi atualizado
    } else {
      // Quando fechar, limpa os resultados e o termo de busca
      setSearchTerm('');
      setSearchResults([]);
    }
  };

  /**
   * Função para atualizar o estado com o texto digitado pelo usuário
   * @param {Event} e - Evento de mudança do input
   */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  /**
   * Função que renderiza cada item de resultado com base no seu tipo
   * Trata diferentemente filmes, séries e pessoas
   * @param {Object} item - Item de resultado da API
   * @returns {JSX.Element} - Elemento React representando o item de resultado
   */
  const renderResultItem = (item) => {
    // Determina o tipo de mídia do item
    const isMovie = item.media_type === 'movie';
    const isTv = item.media_type === 'tv';
    const isPerson = item.media_type === 'person';
    
    // Extrai informações específicas com base no tipo
    // Título: filmes usam 'title', séries e pessoas usam 'name'
    const title = isMovie ? item.title : (isTv || isPerson ? item.name : '');
    
    // Caminho da imagem: filmes/séries usam poster ou backdrop, pessoas usam profile
    const imagePath = isMovie || isTv 
      ? `https://image.tmdb.org/t/p/w92${item.poster_path || item.backdrop_path}`
      : `https://image.tmdb.org/t/p/w92${item.profile_path}`;
    
    // Ano: extrai do release_date para filmes ou first_air_date para séries
    const year = isMovie && item.release_date 
      ? new Date(item.release_date).getFullYear() 
      : (isTv && item.first_air_date ? new Date(item.first_air_date).getFullYear() : '');
    
    // Texto do tipo para exibição
    const type = isMovie ? 'Filme' : (isTv ? 'Série' : 'Pessoa');
    
    // Retorna o elemento JSX para o item
    return (
      <div 
        key={item.id} 
        className="flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer"
        onClick={() => {
          // Ação ao clicar no resultado
          // Aqui você pode implementar a navegação para a página de detalhes
          // Fecha a busca e limpa os estados
          setIsOpen(false);
          setSearchTerm('');
          setSearchResults([]);
        }}
      >
        {/* Imagem do resultado */}
        <img 
          src={imagePath} 
          alt={title}
          className="w-12 h-16 object-cover rounded mr-3"
          onError={(e) => {
            // Fallback para quando a imagem não carrega
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/92x138?text=Sem+Imagem';
          }}
        />
        {/* Informações textuais do resultado */}
        <div className="flex flex-col">
          <span className="text-white font-medium">{title}</span>
          <div className="flex text-xs text-gray-400">
            {year && <span className="mr-2">{year}</span>}
            <span>{type}</span>
          </div>
        </div>
      </div>
    );
  };

  // Renderização do componente
  return (
    <div ref={searchRef} className="relative flex items-center">
      {/* Botão de busca - sempre visível */}
      <button 
        onClick={toggleSearch}
        className="text-white p-2 rounded-full hover:bg-gray-700/50 transition-colors"
        aria-label="Buscar"
      >
        <SearchIcon />
      </button>
      
      {/* Barra de busca expandida - visível apenas quando isOpen é true */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-black/90 border border-gray-700 rounded-md shadow-lg overflow-hidden z-50 w-72 md:w-96">
          {/* Área de input com ícones */}
          <div className="flex items-center p-2 border-b border-gray-700">
            <SearchIcon className="text-gray-400 mr-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Buscar filmes, séries ou atores..."
              className="bg-transparent text-white w-full outline-none"
              autoFocus
            />
            {/* Botão para limpar a busca - visível apenas quando há texto */}
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="text-gray-400 hover:text-white"
              >
                <CloseIcon fontSize="small" />
              </button>
            )}
          </div>
          
          {/* Área de resultados da busca */}
          <div className="max-h-96 overflow-y-auto">
            {/* Estado de carregamento */}
            {isLoading ? (
              <div className="p-4 text-center text-gray-400">
                Buscando...
              </div>
            ) : searchResults.length > 0 ? (
              /* Exibe resultados quando disponíveis */
              <div className="p-2">
                {searchResults.map(renderResultItem)}
              </div>
            ) : searchTerm ? (
              /* Mensagem quando não há resultados para o termo buscado */
              <div className="p-4 text-center text-gray-400">
                Nenhum resultado encontrado.
              </div>
            ) : null /* Não exibe nada se não houver termo de busca */}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFeature;