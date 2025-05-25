const userId = Telegram.WebApp.initDataUnsafe.user.id;

let coins = 0;
let level = 1;
let progress = 0;

function getRomanNumeral(num) {
  const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  return romanNumerals[num - 1] || num;
}

function updateUI() {
  document.getElementById("coinCount").textContent = coins;
  document.getElementById("romanLevel").textContent = getRomanNumeral(level);
  document.getElementById("progressBar").style.width = `${progress}%`;
}

async function collectCoin() {
  coins += 1;
  progress = coins % 100;
  level = Math.floor(coins / 100) + 1;

  updateUI();

  // Save to server
  await fetch('https://krscoin.onrender.com/save ', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, coins, level, progress })
  });
}

// Load user data from server
async function loadUserData() {
  const res = await fetch(`https://krscoin.onrender.com/user/ ${userId}`);
  if (res.ok) {
    const data = await res.json();
    coins = data.coins || 0;
    level = data.level || 1;
    progress = data.progressToNextLevel || 0;
  }
  updateUI();
}

loadUserData();
