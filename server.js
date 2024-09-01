const express = require('express')//модуль для создания и настройки веб-сервера Express

const app = express()
const sessions = require('express-session');//модуль для работы с сеансами в Express

let parseUrl = require('body-parser'); //модуль для обработки данных формы
let encodeUrl = parseUrl.urlencoded({ extended: false });
const cookieParser = require("cookie-parser");

let mysql = require('mysql');//модуль для работы с базами данных MySQL

app.set('view engine', 'ejs')//Устанавливаем шаблонизатор ejs

app.use(express.urlencoded({extended: false}))//для разбора данных формы из запросов
app.use(express.static('public'))// public как статическая папка

app.use(sessions({
    secret: "thisismysecrctekey",
    saveUninitialized:true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, 
    resave: false
}));

app.use(cookieParser());

//подключение к базе данных MySQL
let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: "myform"
});

//Определяем маршруты и обработчики для различных URL-адресов
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/game_time', (req, res) => {
        res.render('game_time');
})

app.get('/game_friend', (req, res) => {
    res.render('game_friend')
})

app.get('/3row', (req, res) => {
    res.render('3row');
})


app.get('/register', (req, res) => {
    res.render('register')
})

//Обработка данных при регистрации
app.post('/register', encodeUrl, (req, res) => {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var userName = req.body.userName;
    var password = req.body.password;

    con.connect(function(err) {
        if (err){
            console.log(err);
        };
        // проверка пользователя, зарегистрирован или нет
        con.query(`SELECT * FROM users WHERE username = '${userName}' AND password  = '${password}'`, function(err, result){
            if(err){
                console.log(err);
            };
            if(Object.keys(result).length > 0){
                res.render('failReg')
            }else{
            //Функция для создания домашней страницы пользователя
            function userPage(){
                req.session.user = {
                    firstname: firstName,
                    lastname: lastName,
                    username: userName,
                    password: password 
                };

                res.render('home_user',{user: req.session.user.username})
            }
                // Вставка новых данных пользователя
                var sql = `INSERT INTO users (firstname, lastname, username, password) VALUES ('${firstName}', '${lastName}', '${userName}', '${password}')`;
                con.query(sql, function (err, result) {
                    if (err){
                        console.log(err);
                    }else{
                        // Создание домашней страницы
                        userPage();
                    };
                });
        }
        });
    });
});

app.get("/login", (req, res)=>{
    res.render('login')
});

//Обработка данных при входе
app.post("/dashboard", encodeUrl, (req, res)=>{
    var userName = req.body.userName;
    var password = req.body.password;

    con.connect(function(err) {
        if(err){
            console.log(err);
        };
        con.query(`SELECT * FROM users WHERE username = '${userName}' AND password = '${password}'`, function (err, result) {
          if(err){
            console.log(err);
          };

          function userPage(){
            req.session.user = {
                firstname: result[0].firstname,
                lastname: result[0].lastname,
                username: userName,
                password: password 
            };

            res.render('home_user',{user: req.session.user.username})
        }

        if(Object.keys(result).length > 0){
            userPage();
        }else{
            res.render('failLog')
        }

        });
    });
});

 
//Запуск сервера
const PORT= 3001
app.listen(PORT, () => {
    console.log(`Server started: http://localhost:${PORT}`)
})

