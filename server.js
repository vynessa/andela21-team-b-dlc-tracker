import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import auth from './controllers/auth';
import modules from './routes/modules';
import dashboard from './routes/dashboard';
import firebase from './helpers/firebase';

dotenv.config({ path: '.env' });
const db = firebase.database();

const app = express();
// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Append user details to the request object
app.use((req, res, next) => {
  const user = firebase.auth().currentUser;
  if (user) {
    db.ref(`users/${user.uid}`).on('value', (snapshot) => {
      req.user = snapshot.val();
      next();
    });
  } else {
    res.status(401).redirect('/');
  }
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running at ${port}`);
});

app.post('/register', auth.register);
app.post('/login', auth.login);
app.get('/signOut', auth.signOut);
app.get('/module', modules);
app.get('/dashboard', dashboard);


// load the routes
export default app;
