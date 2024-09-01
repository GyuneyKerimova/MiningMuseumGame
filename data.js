const express = require('express')
const app = express()
const mysql = require('mysql');
const fs = require('fs'); //модуль для работы с внутренними файлами 
app.set('view engine', 'ejs')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'game'
});

// Функция для замены значения в файле script_time
const replaceInTime = (deckValue, timerValue) => {
    const filePath_timer = './public/js/script_time.js';
    // Чтение файла
    fs.readFile(filePath_timer, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
  
      // Разделение файла на строки
      const lines = data.split('\n');
  
      // Поиск нужной строки
      const index1 = lines.findIndex(line => line.trim().startsWith('let deck ='));
      const index2 = lines.findIndex(line => line.trim().startsWith('let timer ='));
      
      if (index1 !== -1 && index2 !== -1) {
        // Замена строки на новое значение
        lines[index1] = `let deck = [${deckValue}];`;
        lines[index2] = `let timer = ${timerValue};`;
        
        // Объединение строк обратно в файл
        const updatedData = lines.join('\n');
  
        // Запись обновленного файла
        fs.writeFile(filePath_timer, updatedData, 'utf8', (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log('Файл успешно обновлен');
        });
      } else {
        console.log('Строка не найдена');
      }
    });
};

// Функция для замены значения в файле script_friend.js
const replaceInFriend = (deckValue, gridWidthValue, gridHeightValue) => {
    const filePath_friend = './public/js/script_friend.js';
    // Чтение файла
    fs.readFile(filePath_friend, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
  
      // Разделение файла на строки
      const lines = data.split('\n');
  
      // Поиск первой строки, начинающейся с 'let timer ='
      const index1 = lines.findIndex(line => line.trim().startsWith('let deck ='));
      const index2 = lines.findIndex(line => line.trim().startsWith('let gridWidth ='));
      const index3 = lines.findIndex(line => line.trim().startsWith('let gridHeight ='));
      
      if (index1 !== -1 && index2 !== -1 && index3 !== -1) {
        // Замена строки на новое значение
        lines[index1] = `let deck = [${deckValue}];`;
        lines[index2] = `let gridWidth = ${gridWidthValue};`;
        lines[index3] = `let gridHeight = ${gridHeightValue};`;
        
        // Объединение строк обратно в файл
        const updatedData = lines.join('\n');
  
        // Запись обновленного файла
        fs.writeFile(filePath_friend, updatedData, 'utf8', (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log('Файл успешно обновлен');
        });
      } else {
        console.log('Строка не найдена');
      }
    });
};

let deck = [];
let timer = 0; 
let gridWidth = 0; 
let gridHeight = 0;

//Присваивание переменным значения из базы данных
const fetchFromDatabase = (callback) => {
  connection.connect((err) => {
    if (err) {
      callback(err);
      return;
    }
    console.log('Успешное потключение');

    // Получение значений из таблицы name_card
    const selectNameCardsQuery = 'SELECT name FROM name_card';
    connection.query(selectNameCardsQuery, (err, nameCardsResult) => {
      if (err) {
        callback(err);
        return;
      }

      nameCardsResult.forEach((row) => {
        deck.push(row.name);
      });

      console.log('Deck:', deck);

      // Получение значений из таблицы game_settings
      const selectGameSettingsQuery = 'SELECT time, gridWidth, gridHeight FROM game_settings';
      connection.query(selectGameSettingsQuery, (err, gameSettingsResult) => {
        if (err) {
          callback(err);
          return;
        }

        if (gameSettingsResult.length > 0) {
          timer = gameSettingsResult[0].time;
          gridWidth = gameSettingsResult[0].gridWidth;
          gridHeight = gameSettingsResult[0].gridHeight;

          console.log('Timer:', timer);
          console.log('Grid Width:', gridWidth);
          console.log('Grid Height:', gridHeight);
        }

        connection.end();
        callback(null, deck, timer, gridWidth, gridHeight);
      });
    });
  });
};

fetchFromDatabase((err, deck, timer, gridWidth, gridHeight) => {
  if (err) {
    console.error(err);
    return;
  }

  replaceInTime(deck, timer);
  replaceInFriend(deck, gridWidth, gridHeight);
 
});


