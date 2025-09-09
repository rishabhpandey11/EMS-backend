import dotenv from 'dotenv';
import { app } from './app.js';
import connectDB from './db/db.js';


// Always load the .env file first
dotenv.config({
  path: './.env'
});

connectDB()
  .then(async () => {
    // Start the server
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT || 8000}`);
    });


  })
  .catch((err) => {
    console.log("❌ MongoDB connection failed!", err);
  });
