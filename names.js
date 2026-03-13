const CENTER_ANIMATION_MS = 1500;
const FADE_ANIMATION_MS = 120;
const MOVE_ANIMATION_MS = 312;

let showingResults = false;
let usedNames = new Set();

const form = document.getElementById("name-generator-form");
const textarea = document.getElementById("name-list");
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

function getFinalCardPositions(cards) {
  const positions = [];
  const containerRect = resultNames.getBoundingClientRect();

  let i = 0;

  while (i < cards.length) {
    const rect = cards[i].getBoundingClientRect();

    positions.push({
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

  resultNames.style.height = Math.ceil(maxBottom) + "px";
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

  setTimeout(function () {
    card.classList.remove("is-center");
    card.classList.add("is-centered-idle");
    card.classList.add("is-fading");

    setTimeout(function () {
      card.classList.remove("is-centered-idle");
      card.classList.remove("is-fading");
      card.classList.add("is-moving");

      setTimeout(function () {
        done();
      }, MOVE_ANIMATION_MS);
    }, FADE_ANIMATION_MS);
  }, CENTER_ANIMATION_MS);
}

function finishAnimation(names) {
  renderStaticCards(names);
  resultNames.classList.remove("is-animating");
  resultNames.style.height = "";
  showingResults = false;
}

function animateResults(names) {
  showingResults = true;
  renderStaticCards(names);

  const nodeList = resultNames.querySelectorAll(".result-number");
  const cards = [];
  let i = 0;

  while (i < nodeList.length) {
    cards.push(nodeList[i]);
    i += 1;
  }

  const positions = getFinalCardPositions(cards);

  lockContainerHeight(positions);
  prepareCardsForAnimation(cards, positions);

  resultNames.classList.add("is-animating");

  if (cards.length === 0) {
    finishAnimation(names);
    return;
  }

  animateCard(cards[0], function () {
    finishAnimation(names);
  });
}

function pickRandomName(names) {
  const available = [];
  let i = 0;

  while (i < names.length) {
    if (!usedNames.has(names[i])) {
      available.push(names[i]);
    }

    i += 1;
  }

  if (available.length === 0) {
    return null;
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

  if (names.length === 0) {
    showError("Informe pelo menos um nome separado por vírgula.");
    resultWrap.classList.add("is-hidden");
    return;
  }

  const picked = pickRandomName(names);

  if (!picked) {
    showError("Todos os nomes já foram sorteados. Edite a lista para continuar.");
    return;
  }

  clearError();
  resultWrap.classList.remove("is-hidden");
  animateResults([picked]);
}

form.addEventListener("submit", handleSubmit);

textarea.addEventListener("input", function () {
  clearError();
  usedNames = new Set();
});
