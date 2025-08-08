import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import  userRoute from './routes/user.route.js';  
import postRoute from './routes/post.route.js'; 
import messageRoute from './routes/message.route.js';
import {app,server} from './socket/socket.js';

// Load environment variables
dotenv.config({});

const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin); // Reflect the request origin
  },
  credentials: true,
}));


app.get('/', (req, res) => {
  return res.status(200).json({
     message: 'Welcome to the backend server!' ,
     success: true

    });   
});              
//Middleware setup

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));


//API routers
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);
 
server.listen(PORT, () => {
    connectDB()
  console.log(`Server is running on port ${PORT}`);
}); 


