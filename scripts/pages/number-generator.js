const MAX_AMOUNT = 10;
const CENTER_ANIMATION_MS = 1500;
const FADE_ANIMATION_MS = 120;
const MOVE_ANIMATION_MS = 312;
const STAGGER_MS = 90;

let numberOfResults = 0;
let showingResults = false;
let usedNumbers = new Set();

const form = document.getElementById("generator-form");
const formWrap = document.getElementById("generator-form-wrap");
const resultWrap = document.getElementById("result-wraper");
const errorElement = document.getElementById("form-error");
const resultAmount = document.querySelector(".result-amount");
const resultNumbers = document.querySelector(".result-numbers");
const retryButton = document.getElementById("retry-button");
const backButton = document.getElementById("back-button");

const amountInput = document.getElementById("number-amount");
const fromInput = document.getElementById("number-from");
const untilInput = document.getElementById("number-until");
const repeatInput = document.getElementById("number-repeat");

function enforceInputLimit(input, maxDigits, maxValue) {
  input.addEventListener("input", () => {
    let digits = input.value.replace(/\D/g, "");

    if (digits.length > maxDigits) {
      digits = digits.slice(0, maxDigits);
    }

    if (digits === "") {
      input.value = "";
      return;
    }

    const parsed = Number.parseInt(digits, 10);
    input.value = String(Math.min(parsed, maxValue));
  });
}

enforceInputLimit(amountInput, 2, MAX_AMOUNT);
enforceInputLimit(fromInput, 3, 999);
enforceInputLimit(untilInput, 3, 999);

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parseFormValues() {
  const values = {
    amount: Number.parseInt(amountInput.value, 10),
    min: Number.parseInt(fromInput.value, 10),
    max: Number.parseInt(untilInput.value, 10),
    allowRepeat: !repeatInput.checked,
  };

  return values;
}

function showError(message) {
  errorElement.textContent = message;
  errorElement.classList.add("is-visible");
}

function clearError() {
  errorElement.textContent = "";
  errorElement.classList.remove("is-visible");
}

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

  if (max > 999) {
    return "O valor máximo permitido é 999.";
  }

  if (min < 0) {
    return "O valor mínimo permitido é 0.";
  }

  return null;
}

function generateNumbers(values) {
  const numbers = [];
  const amount = values.amount;
  const min = values.min;
  const max = values.max;
  const allowRepeat = values.allowRepeat;

  if (allowRepeat) {
    let i = 0;

    while (i < amount) {
      numbers.push(randomBetween(min, max));
      i += 1;
    }

    return numbers;
  }

  // Mantem a regra de nao repeticao entre rodadas, nao apenas dentro do resultado atual.
  const available = [];
  let n = min;

  while (n <= max) {
    if (!usedNumbers.has(n)) available.push(n);
    n += 1;
  }

  const drawCount = Math.min(amount, available.length);
  let i = 0;

  while (i < drawCount) {
    const idx = Math.floor(Math.random() * available.length);
    numbers.push(available[idx]);
    usedNumbers.add(available[idx]);
    available.splice(idx, 1);
    i += 1;
  }

  return numbers;
}

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

function getFinalCardPositions(cards) {
  const positions = [];
  const containerRect = resultNumbers.getBoundingClientRect();

  let i = 0;

  while (i < cards.length) {
    const rect = cards[i].getBoundingClientRect();

    positions.push({
      // A animacao usa coordenadas relativas ao container, nao a viewport.
      left: rect.left - containerRect.left,
      top: rect.top - containerRect.top,
      width: rect.width,
      height: rect.height,
    });

    i += 1;
  }

  return positions;
}

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

function animateCard(card, done) {
  card.classList.add("is-center");

  setTimeout(() => {
    card.classList.remove("is-center");
    card.classList.add("is-centered-idle");
    card.classList.add("is-fading");

    setTimeout(() => {
      card.classList.remove("is-centered-idle");
      card.classList.remove("is-fading");
      card.classList.add("is-moving");

      setTimeout(() => {
        done();
      }, MOVE_ANIMATION_MS);
    }, FADE_ANIMATION_MS);
  }, CENTER_ANIMATION_MS);
}

function finishAnimation(numbers) {
  renderStaticCards(numbers);
  resultNumbers.classList.remove("is-animating");
  resultNumbers.style.height = "";
  showingResults = false;
}

function animateResults(numbers) {
  showingResults = true;
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

  // Executa os cards em sequencia para preservar o efeito de cascata.
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

function formBack() {
  resultWrap.classList.add("is-hidden");
  formWrap.classList.remove("is-hidden");
  clearError();
  usedNumbers = new Set();
  retryButton.disabled = false;
  numberOfResults = 0;
  amountInput.focus();
}

function handleSubmit(event) {
  if (event) event.preventDefault();

  const values = parseFormValues();
  const validationError = validateValues(values);

  if (validationError) {
    showError(validationError);
    return;
  }

  clearError();
  numberOfResults += 1;

  const numbers = generateNumbers(values);
  resultAmount.textContent = String(numberOfResults);

  if (!values.allowRepeat) {
    const rangeSize = values.max - values.min + 1;
    if (usedNumbers.size >= rangeSize) {
      retryButton.disabled = true;
    }
  }

  showResults();
  animateResults(numbers);
}

form.addEventListener("submit", handleSubmit);

retryButton.addEventListener("click", () => {
  if (showingResults) return;
  handleSubmit();
});

backButton.addEventListener("click", () => {
  if (showingResults) return;
  formBack();
});
