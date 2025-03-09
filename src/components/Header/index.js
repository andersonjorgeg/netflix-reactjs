import React from 'react';

// A prop 'black' controla se o cabeçalho deve ter fundo preto ou transparente
function Header({black}) {
  return (
    // flex para layout, fixed para fixar no topo, w-full para largura total
    // Transição suave quando o fundo muda para preto
    <header className={`flex justify-between items-center fixed w-full py-2 px-3 md:py-4 md:px-6 z-20 transition-all duration-300 ${black ? 'bg-netflixBlack' : 'bg-transparent'}`}>
      {/* Container para o logo da Netflix - tamanho menor em mobile */}
      <div className="flex-none">
        <a href="/">
          {/* Imagem responsiva - menor em dispositivos móveis, maior em desktop */}
          <img 
            className="h-6 sm:h-7 md:h-8 object-contain" 
            src="https://logodownload.org/wp-content/uploads/2014/10/netflix-logo-5.png" 
            alt="Netflix" 
          />
        </a>
      </div>
      
      {/* Container para o avatar/ícone do usuário */}
      <div className="flex-none">
        <a href="/">
          {/* Avatar responsivo com bordas arredondadas */}
          <img 
            className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-sm object-cover" 
            src="https://pbs.twimg.com/profile_images/1165907170178695168/JLkRF8ZY_400x400.png" 
            alt="Usuário" 
          />
        </a>
      </div>
    </header>
  )
}

// Exporta o componente Header para ser usado em outros arquivos
export default Header;