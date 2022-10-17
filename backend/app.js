require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { REG_EXP_URL } = require('./utils/constants');
const NotFoundError = require('./errors/not-found-errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

process.on('uncaughtException', (err, origin) => {
  console.log(
    `${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`,
  );
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());

// Разрешенные адреса для CORS
const allowedCors = [
  'https://place.students.nomoredomains.icu',
  'http://place.students.nomoredomains.icu',
  'http://localhost:3000',
  'https://localhost:3000',
];

// Мидлвара для CORS. Проверяет заголовки и подставляет необходимые
app.use((req, res, next) => {
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, HEAD, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
    return res.end();
  }
  return next();
});

app.use(requestLogger); // подключаем логгер запросов

// Тестирование - краштест. Необходимо будет удалить после прохождения ревью.
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(REG_EXP_URL),
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
}), auth);

app.use('/', routerUsers);

app.use('/', routerCards);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // Обработчик ошибок celebrate

// Обработчик несуществующих роутов
app.use('/', (req, res, next) => {
  next(new NotFoundError('Сервер не может найти запрошенный ресурс'));
});

// централизованный обработчик ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`Приложение слушает порт: ${PORT}`);
});
