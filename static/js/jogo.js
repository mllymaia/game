// Função para verificar se o jogador está logado
const verificarLogin = () => {
  const player = localStorage.getItem('player'); // Recupera o nome do jogador do localStorage

  if (!player) { // Se o nome não estiver salvo, redireciona para a página de login
      alert('Você precisa fazer login antes de acessar o jogo!');
      window.location.href = "http://localhost:8000/"; // Redireciona para a página de login
  } else {
      const spanPlayer = document.querySelector('.player'); // Exibe o nome do jogador na interface do jogo
      spanPlayer.innerHTML = player;
  }
};

// Seleção de elementos DOM
const grid = document.querySelector('.grid');
const tentativas = document.querySelector('.tentativas');
const tempoDisplay = document.querySelector('.tempo');

// Variáveis globais
let numTentativas = 0;
let tempoDeJogo = 0;
let timer;
let firstCard = '';
let secondCard = '';

// Lista de personagens
const characters = [
'blood reina',
'pedra da anomalia',
'skaikru',
'the100',
'theflame',
'trikru',
];

// Função para criar elementos HTML com classes específicas
const createElement = (tag, className) => {
const element = document.createElement(tag);
element.className = className;
return element;
};

// Função para verificar fim de jogo
const checkEndGame = () => {
const disabledCards = document.querySelectorAll('.disabled-card');
const totalCards = document.querySelectorAll('.card').length;

if (disabledCards.length === totalCards) {
  pararCronometro();
  document.querySelector("#msg").innerHTML = `Parabéns, ${localStorage.getItem('player')}! Fim de Jogo!`;
  document.querySelector("#nome").value = localStorage.getItem('player');
  document.querySelector("#tentativas").value = numTentativas;
  document.querySelector("#tempo").value = formatarTempo(tempoDeJogo);

  // Exibir modal
  $("#exampleModal").modal('show');
}
};

// Função para verificar se duas cartas são iguais
const checkCards = () => {
const firstCharacter = firstCard.getAttribute('data-character');
const secondCharacter = secondCard.getAttribute('data-character');

if (firstCharacter === secondCharacter) {
  firstCard.firstChild.classList.add('disabled-card');
  secondCard.firstChild.classList.add('disabled-card');

  firstCard = '';
  secondCard = '';

  checkEndGame();
} else {
  setTimeout(() => {
    firstCard.classList.remove('reveal-card');
    secondCard.classList.remove('reveal-card');

    firstCard = '';
    secondCard = '';

    exibirMensagem("Não formou par!", "warning", true);
  }, 500);
}
};

// Função para revelar carta
const revealCard = ({ target }) => {
if (target.parentNode.className.includes('reveal-card')) {
  return;
}

if (firstCard === '') {
  target.parentNode.classList.add('reveal-card');
  firstCard = target.parentNode;
} else if (secondCard === '') {
  target.parentNode.classList.add('reveal-card');
  secondCard = target.parentNode;

  checkCards();
}

numTentativas++;
tentativas.innerHTML = numTentativas;
};

// Função para criar cartas
const createCard = (character) => {
const card = createElement('div', 'card');
const front = createElement('div', 'face front');
const back = createElement('div', 'face back');

front.style.backgroundImage = `url('/static/img/${character}.jpg')`;

card.appendChild(front);
card.appendChild(back);

card.addEventListener('click', revealCard);
card.setAttribute('data-character', character);

return card;
};

// Função para carregar o jogo
const carregarJogo = () => {
const duplicateCharacters = [...characters, ...characters];
const shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5);

shuffledArray.forEach((character) => {
  const card = createCard(character);
  grid.appendChild(card);
});
};

// Função para formatar tempo em minutos e segundos
const formatarTempo = (segundos) => {
const minutos = Math.floor(segundos / 60);
const seg = segundos % 60;
return `${minutos.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
};

// Função para iniciar o cronômetro
const iniciarCronometro = () => {
timer = setInterval(() => {
  tempoDeJogo++;
  tempoDisplay.innerHTML = formatarTempo(tempoDeJogo);
}, 1000);
};

// Função para parar o cronômetro
const pararCronometro = () => {
clearInterval(timer);
};

// Função para exibir mensagens na interface
const exibirMensagem = (mensagem, tipo, exibirAcima = false) => {
const mensagemBox = document.createElement('div');
mensagemBox.className = `alert alert-${tipo}`;
mensagemBox.textContent = mensagem;
mensagemBox.style.position = "fixed";
mensagemBox.style.top = exibirAcima ? "10px" : "auto";
mensagemBox.style.bottom = exibirAcima ? "auto" : "10px";
mensagemBox.style.left = "50%";
mensagemBox.style.transform = "translateX(-50%)";
mensagemBox.style.zIndex = "1000";
document.body.appendChild(mensagemBox);

setTimeout(() => {
  mensagemBox.remove();
}, 2000);
};

// Função para enviar dados ao servidor
const enviarDados = () => {
const nome = localStorage.getItem('player');
const tentativasFeitas = numTentativas;

fetch('/jogo/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
  },
  body: new URLSearchParams({
    nome,
    tempo: tempoDeJogo,
    tentativas: tentativasFeitas,
  }),
})
  .then((response) => response.json())
  .then((data) => {
    if (data.status === 'sucesso') {
      exibirMensagem('Dados salvos com sucesso!', 'success');
    } else {
      exibirMensagem('Erro ao salvar os dados.', 'danger');
    }
  })
  .catch((error) => {
    console.error('Erro:', error);
    exibirMensagem('Erro ao salvar os dados.', 'danger');
  });
};

// Inicializar jogo
window.onload = () => {
verificarLogin(); // Verifica login ao carregar a página
carregarJogo();
iniciarCronometro();
};
