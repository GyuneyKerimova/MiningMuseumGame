let container = document.getElementById("container");
let previousElement = null;
let deck = ['Тальк серовато-зеленый','Тальк голубовато-зеленый','Тальк серый','Гипс «роза пустыни»','Гипс «марьино стекло»','Гипс «парижский двойник»','Кальцит медово-желтый','Кальцит бесцветный','Кальцит белый','Флюорит светло-голубой','Флюорит светло-желтый','Флюорит светло-зеленый','Апатит зеленый','Апатит желто-зеленый','Апатит голубой','Ортоклаз розовато-бежевый','Ортоклаз розовый','Ортоклаз бежевый','Горный хрусталь','Аметист','Цитрин','Топаз голубой','Топаз бесцветный','Топаз полихромный','Сапфир','Корунд серовато-синий','Рубин','Алмаз желтый','Алмаз светло-коричневый','Алмаз коричневый','Кианит серовато-синий','Кианит синий'];
let cards = [];
let timerElement = document.getElementById("timer");
let timer = 60;
let score = 0; 
let gridWidth = 0; 
let gridHeight = 0; 
let count=0;
let maxx = deck.length;//Максимальное количество карт который сможет использовать пользователь при наначении сетки 
if (maxx%2!=0)
    maxx--
    
function startGame(gridHeight, gridWidth){
    count= gridHeight * gridWidth;
    shuffle(deck);

    // Создание карточек 
    for (let i = 0; i < (count/2); i++) {
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
    
    // Запуск таймера
    let timerId = setInterval(function() {
        timer--;
        let minutes = Math.floor(timer / 60);
        let seconds = timer % 60;
        timerElement.textContent = `Время: ${formatTime(minutes)}:${formatTime(seconds)}`;

        if (timer === 0) {
            clearInterval(timerId);
            hideAllCards();
            document.getElementById("message_loss").classList.remove("hidden");
            document.getElementById("restartButton").style.display = "block";
        }
    }, 1000);

    // Настройка игровой сетки
    document.getElementById("check").style.display = "none";//убираем поле для настройки игровой сетки
    container.style.gridTemplateColumns = `repeat(${gridWidth}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${gridHeight}, 1fr)`;
    for (let i = 0; i < count; i++) {
        let card = cards[i];
        let square = document.createElement("div");
        square.className = "square square_closed";
        container.appendChild(square); 
        square.addEventListener("click", function() {
            flipCard(square, card, timerId);
        });
    }
}

//Клик на карточку
function flipCard(square, card, timerId) {
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
                    score++;
                    document.getElementById("score").textContent = `Баллы: ${score}`;
                    if (score === count/2) {
                        endGame(timerId);
                    }
                }, 500);
            } else {
                setTimeout(function() {
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

//Функция создания адреса картинки 
function getPictures(card_name) {
    return "/images/" + card_name + ".JPG";
}

// Функция для перемешивания массива
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Функция для форматирования времени в формат "00"
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

// Функция для скрытия всех карт на экране
function hideAllCards() {
    let squares = document.getElementsByClassName("square");
    for (let i = 0; i < squares.length; i++) {
        squares[i].style.opacity = 0;
    }
}

//Обновление страницы
function refreshPage() {
    location.reload();
}

//Остановка таймера
function stopTimer(timerId) {
    clearInterval(timerId);
}

//Делает поле ввода сново белым
function clearInput() {
    var input_1 = document.getElementById('grid-width');
    var input_2 = document.getElementById('grid-height');
    input_1.style.backgroundColor = "#fff";
    input_2.style.backgroundColor = "#fff";
    }

//Проверяет настройку сетки игры
function checkSize() {
    var input_1 = document.getElementById('grid-width');
    var input_2 = document.getElementById('grid-height');
    gridWidth = parseInt(input_1.value);
    gridHeight = parseInt(input_2.value);
    
    var result = document.getElementById("result");
    if (gridWidth < 1 || gridHeight<1 || gridHeight*gridWidth>maxx || (gridHeight*gridWidth)%2!=0) {
        input_1.style.backgroundColor = "red";
        input_2.style.backgroundColor = "red";
        result.textContent = `Количество карточек должно быть четным и не привышать ${maxx}`;
    } else{
        result.textContent = "";
        startGame(gridHeight, gridWidth);
    }
}

//При завершении игры, останавливает таймер и  выводит сообщение о победе
function endGame(timerId) {
    stopTimer(timerId);
    document.getElementById("message").classList.remove("hidden");
    document.getElementById("restartButton").style.display = "block";
}





