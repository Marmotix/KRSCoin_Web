// Получаем ID пользователя из Telegram WebApp
const userId = Telegram.WebApp.initDataUnsafe.user.id;

// Локальные данные пользователя
let coins = 0;
let level = 1;
let progress = 0;

// Функция для перевода уровня в римские цифры
function getRomanNumeral(num) {
  const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  return romanNumerals[num - 1] || num;
}

// Обновление интерфейса
function updateUI() {
  document.getElementById("coinCount").textContent = coins;
  document.getElementById("romanLevel").textContent = getRomanNumeral(level);
  document.getElementById("progressBar").style.width = `${progress}%`;
}

// Функция сбора монеты
async function collectCoin() {
  coins += 1;
  progress = coins % 100;
  level = Math.floor(coins / 100) + 1;

  updateUI();

  // Отправка данных на сервер
  try {
    await fetch('https://krscoin.onrender.com/save ', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, coins, level, progress })
    });
  } catch (error) {
    console.error('Ошибка при сохранении:', error);
  }
}

// Загрузка данных пользователя с сервера
async function loadUserData() {
  try {
    const res = await fetch(`https://krscoin.onrender.com/user/ ${userId}`);
    if (res.ok) {
      const data = await res.json();
      coins = data.coins || 0;
      level = data.level || 1;
      progress = data.progressToNextLevel || 0;
    }
  } catch (error) {
    console.error('Ошибка при загрузке:', error);
  }

  updateUI();
}

// Запуск при загрузке
loadUserData();