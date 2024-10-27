// Змінні для білетів, балів, таймера та вибраних чисел
let tickets = 5;
let points = 0;
let timer = 60; // 60 секунд
let selectedNumbers = [];
let isGameActive = false; // Змінна для перевірки активності гри

// Оновлення таймера
function updateTimer() {
    if (timer > 0) {
        timer--;
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        document.getElementById("timerButton").textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    } else {
        // Таймер закінчився
        clearInterval(timerInterval);
        document.getElementById("timerButton").textContent = "Забрати нагороду";
        document.getElementById("timerButton").onclick = claimReward; // Додати функцію для кнопки
    }
}

// Запуск гри
document.getElementById("startGame").addEventListener("click", startGame);

function startGame() {
    if (!isGameActive && tickets >= 1) {
        isGameActive = true; // Активувати гру
        tickets--; // Витрата білету на раунд
        document.getElementById("ticketCount").textContent = tickets;
        showMessage("Раунд почався! Виберіть числа.");
        displayNumberSelection();
    } else if (isGameActive) {
        showMessage("Гра вже активна! Зачекайте результат.");
    } else {
        showMessage("Недостатньо білетів для початку раунду.");
    }
}

// Функція відображення вибору чисел
function displayNumberSelection() {
    const numberSelection = document.getElementById("numberSelection");
    const numberButtons = document.getElementById("numberButtons");

    numberButtons.innerHTML = ''; // Очистити попередні кнопки
    for (let i = 1; i <= 15; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.addEventListener("click", () => selectNumber(i));
        numberButtons.appendChild(button);
    }

    numberSelection.style.display = "block"; // Показати міні-меню
}

// Вибір числа
function selectNumber(number) {
    if (selectedNumbers.includes(number)) {
        selectedNumbers = selectedNumbers.filter(num => num !== number); // Вибір знято
    } else if (selectedNumbers.length < 6) {
        selectedNumbers.push(number); // Додати число
    }

    // Оновити кнопку підтвердження
    document.getElementById("confirmSelection").style.display = selectedNumbers.length === 6 ? "block" : "none";

    // Відображення вибраних чисел
    showMessage(`Вибрані числа: ${selectedNumbers.join(", ")}`);
}

// Підтвердження вибору
document.getElementById("confirmSelection").addEventListener("click", confirmSelection);

function confirmSelection() {
    // Випадкове переможне число
    const winningNumber = Math.floor(Math.random() * 15) + 1;
    showMessage(`Переможне число: ${winningNumber}`);

    if (selectedNumbers.includes(winningNumber)) {
        points += 100; // Виграш
        showMessage(`Вітаємо! Ви виграли 100 балів!`);
    } else {
        points -= 50; // Програш
        showMessage(`На жаль, ви програли 50 балів.`);
    }

    document.getElementById("pointsCount").textContent = points;
    resetGame();
}

// Скидання гри
function resetGame() {
    selectedNumbers = [];
    document.getElementById("numberSelection").style.display = "none"; // Сховати міні-меню
    isGameActive = false; // Деактивувати гру
}

// Функція відображення повідомлень
function showMessage(message) {
    document.getElementById("messageBox").textContent = message;
}

// Таймер
let timerInterval;

function resetTimer() {
    timer = 60; // Скинути таймер на 60 секунд
    document.getElementById("timerButton").textContent = "1:00"; // Відобразити таймер
    clearInterval(timerInterval); // Очистити попередній таймер
    timerInterval = setInterval(updateTimer, 1000); // Запустити новий таймер
}

// Функція для отримання нагороди
function claimReward() {
    tickets += 5; // Додати 5 білетів
    document.getElementById("ticketCount").textContent = tickets; // Оновити відображення білетів
    points += 5; // Додати 5 балів
    document.getElementById("pointsCount").textContent = points;
    resetTimer(); // Перезапустити таймер
}

// Функція для покупки білета
document.getElementById("buyTicket").addEventListener("click", buyTicket);

function buyTicket() {
    if (points >= 100) {
        points -= 100; // Зменшити бали на 100
        tickets += 1;  // Додати 1 білет
        document.getElementById("pointsCount").textContent = points; // Оновити відображення балів
        document.getElementById("ticketCount").textContent = tickets; // Оновити відображення білетів
        showMessage("Успішно куплено 1 білет!"); // Повідомлення про успішну покупку
    } else {
        showMessage("Недостатньо балів для покупки білета."); // Повідомлення про недостатність балів
    }
}

// Запуск таймера кожну секунду
timerInterval = setInterval(updateTimer, 1000);
