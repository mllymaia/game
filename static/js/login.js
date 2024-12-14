const input = document.querySelector('.texto');
const button = document.querySelector('.salvar');
const form = document.querySelector('.login-form');

// Valida o campo de entrada
const validateInput = ({ target }) => {
    if (target.value.length > 2) {
        button.removeAttribute('disabled');
    } else {
        button.setAttribute('disabled', '');
    }
};

// Valida a submissão do formulário
const validarSubmissao = (event) => {
    event.preventDefault();
    localStorage.setItem('player', input.value); // Salva o nome do jogador no localStorage
    window.location.href = "http://localhost:8000/jogo/"; // Redireciona para o jogo
};

input.addEventListener('input', validateInput);
form.addEventListener('submit', validarSubmissao);
