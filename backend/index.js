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
const corsOptions = {
 origin: "https://insta-git-main-ramanamattas-projects.vercel.app",
    
  credentials: true,
};  
app.use(cors(corsOptions));

//API routers
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);
 
server.listen(PORT, () => {
    connectDB()
  console.log(`Server is running on port ${PORT}`);
}); 


