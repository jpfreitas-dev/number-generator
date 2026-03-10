const MAX_AMOUNT = 10;
const CENTER_ANIMATION_MS = 2000;
const CENTER_SETTLE_MS = 220;
const MOVE_ANIMATION_MS = 520;
const STAGGER_MS = 150;

const form = document.getElementById("generator-form");
const formWrap = document.getElementById("generator-form-wrap");
const resultWrap = document.getElementById("result-wraper");
const errorElement = document.getElementById("form-error");
const resultAmount = document.querySelector(".result-amount");
const resultNumbers = document.querySelector(".result-numbers");
const retryButton = document.getElementById("retry-button");

const amountInput = document.getElementById("number-amount");
const fromInput = document.getElementById("number-from");
const untilInput = document.getElementById("number-until");
const repeatInput = document.getElementById("number-repeat");

// Multiplica o "Math.random()" pelo intervalo, arredonda para um número inteiro e depois soma o "min" para ajustar o resultado para o intervalo desejado
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Lê os valores do formulário, converte para números inteiros na base decimal e retorna um objeto com as configurações para a geração dos números
function parseFormValues() {
  const values = {
    amount: Number.parseInt(amountInput.value, 10), 
    min: Number.parseInt(fromInput.value, 10),
    max: Number.parseInt(untilInput.value, 10),
    allowRepeat: !repeatInput.checked,
  };

  return values;
}

// Dispara o erro com a mensagem recebida
function showError(message) {
  errorElement.textContent = message;
  errorElement.classList.add("is-visible");
}

// Limpa o erro, removendo a mensagem
function clearError() {
  errorElement.textContent = "";
  errorElement.classList.remove("is-visible");
}

// Analisa os dados inseridos pelo usuário e decide se o sorteio pode prosseguir ou se há algum erro lógico que impeça a execução
function validateValues(values) {
  const amount = values.amount;
  const min = values.min;
  const max = values.max;
  const allowRepeat = values.allowRepeat;

  if (!Number.isInteger(amount) || !Number.isInteger(min) || !Number.isInteger(max)) {
    return "Preencha todos os campos com números inteiros.";
  }

  if (amount < 1) {
    return "A quantidade de números deve ser pelo menos 1.";
  }

  if (amount > MAX_AMOUNT) {
    return "O limite por sorteio é de " + MAX_AMOUNT + " números.";
  }

  if (min > max) {
    return "O valor inicial não pode ser maior que o valor final.";
  }

  if (!allowRepeat) {
    const rangeSize = max - min + 1;

    if (amount > rangeSize) {
      return "A quantidade não pode ser maior que o tamanho do intervalo.";
    }
  }

  return null;
}

// Decide qual algoritmo usar para criar a lista de números sorteados, baseando-se na escolha do usuário sobre permitir ou não repetições
function generateNumbers(values) {
  const numbers = [];
  const amount = values.amount;
  const min = values.min;
  const max = values.max;
  const allowRepeat = values.allowRepeat;

  // Se repetições são permitidas
  if (allowRepeat) {
    let i = 0;

    while (i < amount) {
      numbers.push(randomBetween(min, max));
      i += 1;
    }

    return numbers;
  }

  // Se repetições não são permitidas
  const selected = new Set();

  while (selected.size < amount) {
    selected.add(randomBetween(min, max));
  }

  selected.forEach(function (value) {
    numbers.push(value);
  });

  return numbers;
}

// Cria a estrutura HTML para exibir um número sorteado
function createNumberCard(number) {
  const card = document.createElement("div");
  card.className = "result-number";

  const background = document.createElement("div");
  background.className = "number-background";

  const text = document.createElement("span");
  text.textContent = String(number);

  card.append(background, text);

  return card;
}

// Renderiza os números sorteados na tela, criando um card para cada número e adicionando-os ao container de resultados
function renderStaticCards(numbers) {
  resultNumbers.innerHTML = "";

  const fragment = document.createDocumentFragment();
  let i = 0;

  while (i < numbers.length) {
    fragment.append(createNumberCard(numbers[i]));
    i += 1;
  }

  resultNumbers.append(fragment);
}

// Calcula as posições finais de cada card de número sorteado, para que a animação possa mover os cards para essas posições
function getFinalCardPositions(cards) {
  const positions = [];
  const containerRect  = resultNumbers.getBoundingClientRect(); // Pega as coordenadas do container para calcular as posições relativas dos cards dentro dele
  
  let i = 0;

  while (i < cards.length) {
    const rect = cards[i].getBoundingClientRect(); // Pega as coordenadas do card para calcular sua posição relativa ao container

    positions.push({
      // Subtrai para que a posição seja relativa ao container, e não à janela inteira
      left: rect.left - containerRect.left, 
      top: rect.top - containerRect.top,
      width: rect.width,
      height: rect.height,
    });

    i += 1;
  }

  return positions;
}

// Define a altura do container de resultados para o valor máximo necessário para acomodar os cards, evitando que o layout mude durante a animação
function lockContainerHeight(positions) {
  let maxBottom = 0;
  let i = 0;

  while (i < positions.length) {
    const bottom = positions[i].top + positions[i].height;

    if (bottom > maxBottom) {
      maxBottom = bottom;
    }

    i += 1;
  }

  resultNumbers.style.height = Math.ceil(maxBottom) + "px";
}

// Prepara os cards para a animação, definindo suas posições iniciais e as variáveis CSS necessárias para a animação de movimento
function prepareCardsForAnimation(cards, positions) {
  let i = 0;

  while (i < cards.length) {
    const card = cards[i];
    const position = positions[i];

    card.classList.add("is-floating");
    card.style.width = position.width + "px";
    card.style.height = position.height + "px";
    card.style.setProperty("--target-left", position.left + "px");
    card.style.setProperty("--target-top", position.top + "px");

    i += 1;
  }
}

// Anima um card específico, movendo-o para o centro da tela e depois para sua posição final, usando as classes CSS para controlar a animação e chamando a função de callback quando a animação estiver completa
function animateCard(card, done) {
  card.classList.add("is-center");

  setTimeout(() => {
    card.classList.remove("is-center"); setTimeout(() => {
      card.classList.add("is-moving"); setTimeout(() => {
        done();
      }, MOVE_ANIMATION_MS);
    }, CENTER_SETTLE_MS);
  }, CENTER_ANIMATION_MS);
}

function finishAnimation(numbers) {
  renderStaticCards(numbers);
  resultNumbers.classList.remove("is-animating");
  resultNumbers.style.height = "";
}

function animateResults(numbers) {
  renderStaticCards(numbers);

  const nodeList = resultNumbers.querySelectorAll(".result-number");
  const cards = [];
  let i = 0;

  while (i < nodeList.length) {
    cards.push(nodeList[i]);
    i += 1;
  }

  const positions = getFinalCardPositions(cards);

  lockContainerHeight(positions);
  prepareCardsForAnimation(cards, positions);

  resultNumbers.classList.add("is-animating");

  let index = 0;

  function animateNextCard() {
    if (index >= cards.length) {
      finishAnimation(numbers);
      return;
    }

    const card = cards[index];
    index += 1;

    animateCard(card, function () {
      setTimeout(function () {
        animateNextCard();
      }, STAGGER_MS);
    });
  }

  animateNextCard();
}

function showResults() {
  formWrap.classList.add("is-hidden");
  resultWrap.classList.remove("is-hidden");
}

function showForm() {
  resultWrap.classList.add("is-hidden");
  formWrap.classList.remove("is-hidden");
  clearError();
  amountInput.focus();
}

function handleSubmit(event) {
  event.preventDefault();

  const values = parseFormValues();
  const validationError = validateValues(values);

  if (validationError) {
    showError(validationError);
    return;
  }

  clearError();

  const numbers = generateNumbers(values);
  resultAmount.textContent = String(numbers.length);

  showResults();
  animateResults(numbers);
}

function handleRetry() {
  showForm();
}

form.addEventListener("submit", handleSubmit);
retryButton.addEventListener("click", handleRetry);
