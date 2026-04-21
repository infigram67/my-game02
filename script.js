// состояние игры
let state = {
  year: 1914,
  economy: 50,
  army: 50,
  stability: 50,
  diplomacy: 50,
  mode: "internal",
  leaders: {
    "Гитлер": 50,
    "Сталин": 50,
    "Рузвельт": 50,
    "Черчилль": 50
  }
};

// элементы
const menu = document.getElementById("menu");
const game = document.getElementById("game");

const yearEl = document.getElementById("year");
const economyEl = document.getElementById("economy");
const armyEl = document.getElementById("army");
const stabilityEl = document.getElementById("stability");
const diplomacyEl = document.getElementById("diplomacy");
const eventText = document.getElementById("eventText");
const choicesDiv = document.getElementById("choices");

// кнопки
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("restartBtn").addEventListener("click", () => location.reload());
document.getElementById("internalBtn").addEventListener("click", () => setMode("internal"));
document.getElementById("externalBtn").addEventListener("click", () => setMode("external"));

// старт
function startGame() {
  menu.style.display = "none";
  game.style.display = "block";
  updateUI();
  renderChoices();
}

// смена режима
function setMode(mode) {
  state.mode = mode;
  renderChoices();
  updateUI();
}

// обновление UI
function updateUI() {
  yearEl.textContent = state.year;
  economyEl.textContent = state.economy;
  armyEl.textContent = state.army;
  stabilityEl.textContent = state.stability;
  diplomacyEl.textContent = state.diplomacy;

  eventText.textContent =
    `Год ${state.year}. Режим: ${state.mode === "internal" ? "внутренняя политика" : "внешняя политика"}`;
}

// действия
function getInternalActions() {
  return [
    {
      text: "Повысить налоги",
      effect: () => {
        state.economy += 10;
        state.stability -= 10;
      }
    },
    {
      text: "Снизить налоги",
      effect: () => {
        state.economy -= 5;
        state.stability += 10;
      }
    },
    {
      text: "Развивать армию",
      effect: () => {
        state.army += 10;
        state.economy -= 5;
      }
    },
    {
      text: "Социальные программы",
      effect: () => {
        state.stability += 10;
        state.economy -= 5;
      }
    }
  ];
}

function getExternalActions() {
  let actions = [];

  for (let leader in state.leaders) {
    actions.push({
      text: `Улучшить отношения с ${leader}`,
      effect: () => {
        state.leaders[leader] += 10;
        state.diplomacy += 5;
      }
    });

    actions.push({
      text: `Ухудшить отношения с ${leader}`,
      effect: () => {
        state.leaders[leader] -= 15;
        state.stability -= 5;
      }
    });
  }

  return actions;
}

// рендер кнопок
function renderChoices() {
  choicesDiv.innerHTML = "";

  let actions = state.mode === "internal"
    ? getInternalActions()
    : getExternalActions();

  actions.forEach(action => {
    let btn = document.createElement("button");
    btn.textContent = action.text;
    btn.onclick = () => applyAction(action);
    choicesDiv.appendChild(btn);
  });
}

// применение
function applyAction(action) {
  action.effect();

  limitStats();

  state.year++;

  if (checkGameOver()) return;

  updateUI();
}

// ограничения
function limitStats() {
  ["economy", "army", "stability", "diplomacy"].forEach(stat => {
    if (state[stat] > 100) state[stat] = 100;
    if (state[stat] < 0) state[stat] = 0;
  });

  for (let leader in state.leaders) {
    if (state.leaders[leader] > 100) state.leaders[leader] = 100;
    if (state.leaders[leader] < 0) state.leaders[leader] = 0;
  }
}

// проигрыш
function checkGameOver() {
  if (state.stability <= 0) {
    eventText.textContent = "Государство развалилось.";
    return true;
  }
  return false;
}
