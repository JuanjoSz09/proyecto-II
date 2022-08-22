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
  newLinksController,
  getSingleLinksController,
  deleteLinksController,
} = require('./controllers/links');

const { authUser } = require('./middlewares/auth');

const app = express();

app.use(fileUpload());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('./uploads'));


app.post('/user', newUserController);
app.get('/user/:id', getUserController);
app.post('/login', loginController);


app.post('/', authUser, newLinksController);
app.get('/', getLinksController);
app.get('/links/:id', getSingleLinksController);
app.delete('/links/:id', authUser, deleteLinksController);


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


app.listen(3000, () => {
  console.log('Server On');
});
