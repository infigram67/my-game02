let state = {
  year: 1914,
  economy: 50,
  army: 50,
  stability: 50,
  diplomacy: 50,
  mode: "internal",

  countries: {
    Германия: { relation: 50, status: "нейтралитет", desc: "Сильная военная держава Европы" },
    СССР: { relation: 50, status: "нейтралитет", desc: "Государство с мощной идеологией" },
    США: { relation: 50, status: "нейтралитет", desc: "Экономический гигант" }
  },

  leaders: {
    Гитлер: { relation: 50, trait: "агрессивный лидер" },
    Сталин: { relation: 50, trait: "жесткий стратег" },
    Рузвельт: { relation: 50, trait: "дипломатичный реформатор" }
  }
};

function startGame() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("game").style.display = "block";
  updateUI();
  renderChoices();
}

document.getElementById("startBtn").onclick = startGame;

function setMode(mode) {
  state.mode = mode;
  renderChoices();
}

function updateUI() {
  document.getElementById("year").textContent = state.year;
  document.getElementById("economy").textContent = state.economy;
  document.getElementById("army").textContent = state.army;
  document.getElementById("stability").textContent = state.stability;
  document.getElementById("diplomacy").textContent = state.diplomacy;

  document.getElementById("eventText").textContent =
    "Выбери действие";
}

// генерация действий
function renderChoices() {
  let div = document.getElementById("choices");
  div.innerHTML = "";

  if (state.mode === "internal") {
    addButton("Повысить налоги", () => {
      state.economy += 10;
      state.stability -= 10;
    });

    addButton("Поддержать население", () => {
      state.stability += 10;
      state.economy -= 5;
    });

  } else {
    // страны
    for (let c in state.countries) {
      let country = state.countries[c];

      addButton(`Инфо: ${c}`, () => {
        showText(`${c}: ${country.desc}. Отношение: ${country.relation}, статус: ${country.status}`);
      });

      addButton(`Союз с ${c}`, () => {
        country.status = "союз";
        country.relation += 20;
        state.diplomacy += 5;
      });

      addButton(`Враждовать с ${c}`, () => {
        country.status = "война";
        country.relation -= 30;
        state.army += 10;
      });
    }

    // политики
    for (let l in state.leaders) {
      let leader = state.leaders[l];

      addButton(`Инфо: ${l}`, () => {
        showText(`${l}: ${leader.trait}. Отношение: ${leader.relation}`);
      });

      addButton(`Улучшить отношения с ${l}`, () => {
        leader.relation += 10;
        showDialogue(l);
      });

      addButton(`Ухудшить отношения с ${l}`, () => {
        leader.relation -= 15;
        showDialogue(l);
      });
    }
  }
}

// кнопка
function addButton(text, action) {
  let btn = document.createElement("button");
  btn.textContent = text;
  btn.onclick = () => {
    action();
    nextTurn();
  };
  document.getElementById("choices").appendChild(btn);
}

// диалоги
function showDialogue(leader) {
  let rel = state.leaders[leader].relation;

  let text = "";

  if (rel > 70) text = `${leader}: Мы доверяем вам.`;
  else if (rel > 40) text = `${leader}: Сотрудничество возможно.`;
  else text = `${leader}: Мы вам не доверяем.`;

  showText(text);
}

// вывод текста
function showText(text) {
  document.getElementById("eventText").textContent = text;
}

// ход
function nextTurn() {
  state.year++;
  limit();
  updateUI();
}

// ограничения
function limit() {
  ["economy", "army", "stability", "diplomacy"].forEach(s => {
    if (state[s] > 100) state[s] = 100;
    if (state[s] < 0) state[s] = 0;
  });
}
