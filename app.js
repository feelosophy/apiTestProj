const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const Ajv = require('ajv');
const pgp = require('pg-promise')();

const registratitonScheme = require('./scheme/register');
const authScheme = require('./scheme/auth');
const connectionString = require('./settings').connection();
const salt = require('./settings').getSault;

const db = pgp(connectionString);

const app = express();

app.use('/', express.static('public'));
app.use('/auth', express.static('public/auth'));

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extend: false}));

app.use(function (error, res, req, next) {
    console.error(error);
    res.status(500).send('Сервер недоступен!');
});

app.get('/users', function (req, res) {
    db.any("SELECT * FROM peoples")
        .then(function (data) {
            res.render('index', {peoples: data});
        })
        .catch(function (error) {
            console.log("ERROR:", error);
            res.sendStatus(400);
        });
});

app.get('/users/:id', function (req, res, next) {
    db.any("SELECT * FROM peoples WHERE user_id=$1", [req.params.id])
        .then(function (data) {
            res.render('index', {peoples: data});
        })
        .catch(function (error) {
            console.log("ERROR:", error);
            res.sendStatus(400);
        });
});

app.get('/users_all', function (req, res) {
    db.any("SELECT * FROM peoples")
        .then(function (data) {
            res.json(data);
        })
        .catch(function (error) {
            console.log("ERROR:", error);
            res.sendStatus(400);
        });
});

app.post('/submit', function (req, res, next) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    const parameters = {
        name: req.body.name,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        login: req.body.login,
        password: req.body.password,
        avatar: req.body.avatar
    };
    const ajv = new Ajv();
    const valid = ajv.validate(registratitonScheme,parameters);
    if (!valid){
        console.log(ajv.errors);
        return res.send(400);
    }

    const text = 'INSERT INTO peoples(name,last_name,phone_number,email,login,password,avatar) VALUES ($1,$2,$3,$4,$5,$6,$7);';
    parameters.password = bcrypt.hashSync(req.body.password, salt);

    db.none(text,Object.values(parameters))
        .then(function () {
            res.end('/users');
        })
        .catch(function (error) {
            console.log("ERROR:", error);
            res.send('Такой логин уже существует!');
        });
});

app.get('/deleteuser/:id', function (req, res, next) {
    const text = 'DELETE FROM peoples WHERE user_id=$1';
    db.none(text,[req.params.id])
        .then(function () {
            res.redirect('/users');
        })
        .catch(function (error) {
            console.log("ERROR:", error);
            res.sendStatus(400);
        });
});

//Авторизация
app.post('/connect', function (req, res) {
    const parameters = {
        login: req.body.login,
        password: req.body.password,
    };
    const ajv = new Ajv();
    const valid = ajv.validate(authScheme,parameters);
    if (!valid){
        console.log(ajv.errors);
        return res.sendStatus(400);
    }
    
    const text = 'SELECT name, last_name, password FROM peoples WHERE login=$1';
    db.one(text,parameters.login)
        .then(function (data) {
            if (bcrypt.compareSync(parameters.password,data.password)){
                res.send(200, `${data.name} ${data.last_name},you are welcome!`);
            }
            else{
                res.send('Неверный пароль или логин!');
            }
        })
        .catch(function (error) {
            console.log("ERROR:", error);
            res.sendStatus(400);
        });
});

app.listen(3000,function () {
    console.log('Express is running');
});