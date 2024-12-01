// Ініціалізація змінних з локального сховища або зі значень за замовчуванням
let tickets = parseInt(localStorage.getItem("tickets")) || 5;
let points = parseInt(localStorage.getItem("points")) || 0;
let timer = parseInt(localStorage.getItem("timer")) || 60;
let selectedNumbers = [];
let isGameActive = false; // Змінна для перевірки активності гри

// Функція збереження даних у localStorage
function saveGameData() {
    localStorage.setItem("tickets", tickets);
    localStorage.setItem("points", points);
    localStorage.setItem("timer", timer);
}

// Автозбереження кожні 10 секунд
setInterval(saveGameData, 10000);

// Завантаження даних при завантаженні сторінки
function loadGameData() {
    tickets = parseInt(localStorage.getItem("tickets")) || 5;
    points = parseInt(localStorage.getItem("points")) || 0;
    timer = parseInt(localStorage.getItem("timer")) || 60;
    
    // Оновити відображення білетів, балів і таймера
    document.getElementById("ticketCount").textContent = tickets;
    document.getElementById("pointsCount").textContent = points;
    document.getElementById("timerButton").textContent = `${Math.floor(timer / 60)}:${timer % 60 < 10 ? "0" : ""}${timer % 60}`;
}

// Виклик завантаження даних при завантаженні сторінки
loadGameData();

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
        document.getElementById("timerButton").onclick = claimReward;
    }
}

// Запуск гри
document.getElementById("startGame").addEventListener("click", startGame);

// Оновлення функції startGame
function startGame() {
    if (!isGameActive && tickets >= 1) {
        isGameActive = true; // Активувати гру
        tickets--; // Витрата білету на раунд
        document.getElementById("ticketCount").textContent = tickets;

        resetGameColors(); // Скидаємо кольори кнопок

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
    if (points >= 10) {
        points -= 10; // Зменшити бали на 10
        tickets += 1;  // Додати 1 білет
        document.getElementById("pointsCount").textContent = points; // Оновити відображення балів
        document.getElementById("ticketCount").textContent = tickets; // Оновити відображення білетів
        showMessage("Успішно куплено 1 білет!"); // Повідомлення про успішну покупку
    } else {
        showMessage("Недостатньо балів для покупки білета."); // Повідомлення про недостатність балів
    }
}

// Збереження даних при виході зі сторінки
window.addEventListener("beforeunload", saveGameData);

// Запуск таймера кожну секунду
timerInterval = setInterval(updateTimer, 1000);




// Слухач події для кнопки "Придбати бонус"
document.getElementById("buyBonus").addEventListener("click", () => {
    if (points >= 20) { // Перевірка, чи є достатньо балів для покупки бонусу
        points -= 20; // Зменшення балів
        document.getElementById("pointsCount").textContent = points; // Оновлення відображення балів
        showMessage("Ви придбали бонус!");

        // Отримання всіх кнопок з числами
        const numberButtons = document.querySelectorAll(".number-buttons button");

        // Зміна кольорів невиграшних кнопок
        numberButtons.forEach(button => {
            const number = parseInt(button.textContent); // Отримуємо число з кнопки
            if (!selectedNumbers.includes(number)) { // Якщо число не вибране
                button.classList.add("non-winning"); // Додаємо клас
            }
        });
    } else {
        showMessage("Недостатньо балів для покупки бонусу.");
    }
});

// Функція для скидання кольорів при новій грі
function resetGameColors() {
    const numberButtons = document.querySelectorAll(".number-buttons button");
    numberButtons.forEach(button => {
        button.classList.remove("non-winning"); // Видалення класу
    });
}