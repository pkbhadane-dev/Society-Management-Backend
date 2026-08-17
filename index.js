import dotenv, { configDotenv } from "dotenv";
dotenv.config();
import app from "./app.js";
import { connectDB } from "./src/db/connectDB.js"

const PORT = 3001;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on port", PORT);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
