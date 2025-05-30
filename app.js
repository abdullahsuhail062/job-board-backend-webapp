import express from 'express'
const app = express();
const port = 3000;
import dotenv from 'dotenv';
dotenv.config({ path: '.env.development.local' });
import bodyParser from 'body-parser';
import cors from 'cors';
import userRouter from './routes/userRouter.js';
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['X-CSRF-Token', 'X-Requested-With', 'Content-Type', 'Authorization'],
  credentials: true
}));
app.use(cors({
  origin: 'https://job-board-webapp.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // If using cookies/auth
}));
function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or specify the allowed origin
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

}



app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'none'; img-src 'self' https://job-board-backend-webapp.vercel.app; script-src 'self'; style-src 'self'");
  next();
});

app.use('/users', userRouter); // Prefix all routes in userRoutes with /users




export default app;


