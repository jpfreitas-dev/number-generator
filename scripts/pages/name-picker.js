const NAME_OUT_MS = 180;
const NAME_IN_MS = 220;

let showingResults = false;
let usedNames = new Set();

const form = document.getElementById("name-generator-form");
const textarea = document.getElementById("name-list");
const repeatInput = document.getElementById("name-repeat");
const errorElement = document.getElementById("form-error");
const resultWrap = document.getElementById("result-wraper");
const resultNames = document.getElementById("result-names");

function showError(message) {
  errorElement.textContent = message;
  errorElement.classList.add("is-visible");
}

function clearError() {
  errorElement.textContent = "";
  errorElement.classList.remove("is-visible");
}

function parseNames() {
  return textarea.value
    .split(",")
    .map(function (name) {
      return name.trim();
    })
    .filter(function (name) {
      return name.length > 0;
    });
}

function createNameCard(name) {
  const card = document.createElement("div");
  card.className = "result-number";

  const background = document.createElement("div");
  background.className = "number-background";

  const text = document.createElement("span");
  text.textContent = name;

  card.append(background, text);

  return card;
}

function renderStaticCards(names) {
  resultNames.innerHTML = "";

  const fragment = document.createDocumentFragment();
  let i = 0;

  while (i < names.length) {
    fragment.append(createNameCard(names[i]));
    i += 1;
  }

  resultNames.append(fragment);
}

function animateResults(names) {
  showingResults = true;
  const currentCard = resultNames.querySelector(".result-number");

  function animateIn() {
    renderStaticCards(names);

    const nextCard = resultNames.querySelector(".result-number");

    if (!nextCard) {
      showingResults = false;
      return;
    }

    nextCard.classList.add("is-name-entering");

    requestAnimationFrame(function () {
      nextCard.classList.add("is-name-entering-active");
    });

    setTimeout(function () {
      nextCard.classList.remove("is-name-entering");
      nextCard.classList.remove("is-name-entering-active");
      showingResults = false;
    }, NAME_IN_MS);
  }

  if (!currentCard) {
    animateIn();
    return;
  }

  currentCard.classList.add("is-name-leaving");

  setTimeout(function () {
    animateIn();
  }, NAME_OUT_MS);
}

function pickRandomName(names, noRepeat) {
  if (!noRepeat) {
    const idx = Math.floor(Math.random() * names.length);
    return names[idx];
  }

  function getAvailableNames() {
    const available = [];
    let i = 0;

    while (i < names.length) {
      if (!usedNames.has(names[i])) {
        available.push(names[i]);
      }

      i += 1;
    }

    return available;
  }

  let available = getAvailableNames();

  if (available.length === 0) {
    usedNames = new Set();
    available = getAvailableNames();
  }

  const index = Math.floor(Math.random() * available.length);
  const picked = available[index];
  usedNames.add(picked);

  return picked;
}

function handleSubmit(event) {
  event.preventDefault();

  if (showingResults) return;

  const names = parseNames();
  const noRepeat = repeatInput.checked;

  if (names.length === 0) {
    showError("Informe pelo menos um nome separado por virgula.");
    resultWrap.classList.add("is-hidden");
    return;
  }

  const picked = pickRandomName(names, noRepeat);

  clearError();
  resultWrap.classList.remove("is-hidden");
  animateResults([picked]);
}

form.addEventListener("submit", handleSubmit);

textarea.addEventListener("input", function () {
  clearError();
  usedNames = new Set();
});

repeatInput.addEventListener("change", function () {
  clearError();

  if (!repeatInput.checked) {
    usedNames = new Set();
  }
});
