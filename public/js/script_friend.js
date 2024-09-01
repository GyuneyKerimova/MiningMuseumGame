let container = document.getElementById("container");
let previousElement = null;
let deck = ['Тальк серовато-зеленый','Тальк голубовато-зеленый','Тальк серый','Гипс «роза пустыни»','Гипс «марьино стекло»','Гипс «парижский двойник»','Кальцит медово-желтый','Кальцит бесцветный','Кальцит белый','Флюорит светло-голубой','Флюорит светло-желтый','Флюорит светло-зеленый','Апатит зеленый','Апатит желто-зеленый','Апатит голубой','Ортоклаз розовато-бежевый','Ортоклаз розовый','Ортоклаз бежевый','Горный хрусталь','Аметист','Цитрин','Топаз голубой','Топаз бесцветный','Топаз полихромный','Сапфир','Корунд серовато-синий','Рубин','Алмаз желтый','Алмаз светло-коричневый','Алмаз коричневый','Кианит серовато-синий','Кианит синий'];
let cards = [];
let currentPlayer = 1;
let score1 = 0;
let score2 = 0;
let gridWidth = 4;
let gridHeight = 4;
let count= gridHeight * gridWidth;

container.style.gridTemplateColumns = `repeat(${gridWidth}, 1fr)`;
container.style.gridTemplateRows = `repeat(${gridHeight}, 1fr)`;

// Перемешивание названий минералов
shuffle(deck);

// Создание карточек с рандомным выбором цветов
for (let i = 0; i < count/2; i++) {
    let card_name = deck[i];
    cards.push({
        card_name: card_name,
        image: getPictures(card_name)
    });
    cards.push({
        card_name: card_name,
        image: getPictures(card_name)
    });
}

// Перемешивание карточек
shuffle(cards);

// Генерация HTML для карточек
for (let i = 0; i < cards.length; i++) {
    let card = cards[i];
    let square = document.createElement("div");
    square.className = "square square_closed";
    container.appendChild(square); 
    square.addEventListener("click", function() {
        flipCard(square, card);
    });
}

function flipCard(square, card) {
    if (square.classList.contains("square_closed")) {
        square.classList.remove("square_closed");
        square.style.backgroundImage = `url("${card.image}")`;
        square.textContent = card.card_name;

        if (previousElement === null) {
            previousElement = square;
        } else {
            if (previousElement.textContent === square.textContent) {
                setTimeout(function() {
                    previousElement.style.opacity = 0;
                    square.style.opacity = 0;
                    previousElement = null;
                    if (currentPlayer === 1) {
                        document.getElementById('player1').style.color = "#ffeb3b";
                        document.getElementById('player2').style.color = "#fff";
                        currentPlayer = 1;
                        score1 += 1;
                        document.getElementById("score1").textContent = `Очки Игрока 1: ${score1}`;
                    } else {
                        currentPlayer = 2;
                        document.getElementById("player1").style.color = "#fff";
                        document.getElementById("player2").style.color = "#ffeb3b";
                        score2 += 1;
                        document.getElementById("score2").textContent = `Очки Игрока 2: ${score2}`;
                    }
                    if (score1 + score2 === (count/2)) {
                        endGame();
                    }
                }, 500);
            } else {
                setTimeout(function() {
                    if (currentPlayer === 1) {
                        currentPlayer = 2;
                        document.getElementById("player1").style.color = "#fff";
                        document.getElementById("player2").style.color = "#ffeb3b";
                    } else {
                        currentPlayer = 1;
                        document.getElementById('player1').style.color = "#ffeb3b";
                        document.getElementById('player2').style.color = "#fff";
                    }
                    previousElement.classList.add("square_closed");
                    square.classList.add("square_closed");
                    previousElement.style.backgroundImage = "";
                    square.style.backgroundImage = "";
                    previousElement.textContent = "";
                    square.textContent = "";
                    previousElement = null;
                }, 500);
            }
        }
    }
}

function endGame() {
    let winner = "";
    if (score1 > score2) {
        winner = "Игрок 1";
    } else if (score1 < score2) {
        winner = "Игрок 2";
    } else {
        document.getElementById("message").textContent = "Ничья!";
        document.getElementById("message").classList.remove("hidden");
        document.getElementById("restartButton").style.display = "block";
        return;
    }

    let message = `Победил ${winner}! Количество баллов: ${winner === "Игрок 1" ? score1 : score2}`;
    document.getElementById("message").textContent = message;
    document.getElementById("message").classList.remove("hidden");
    document.getElementById("restartButton").style.display = "block";
}

// Функция для перемешивания массива
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

//Создаем адрес карточки 
function getPictures(card_name) {
    return "/images/" + card_name + ".JPG";
}

//Обновляем страницу
function refreshPage() {
    location.reload();
}

































