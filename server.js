require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');

const {
  newUserController,
  getUserController,
  loginController,
} = require('./controllers/users');

const {
  getLinksController,
  newLinkController,
  getSingleLinkController,
  deleteLinkController,
} = require('./controllers/links');

const { authUser } = require('./middlewares/authUser');

const { PORT } = process.env;

const app = express();

app.use(fileUpload());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('./uploads'));

app.post('/user', newUserController);
app.get('/user/:id', getUserController);
app.post('/login', loginController);

app.post('/', authUser, newLinkController);
app.get('/', getLinksController);
app.get('/links/:id', getSingleLinkController);
app.delete('/links/:id', authUser, deleteLinkController);

app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Not found',
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.httpStatus || 500).send({
    status: 'error',
    message: error.message,
  });
});

app.listen(PORT, () => {
  console.log('Server On');
});
