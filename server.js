require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const authService = require("./service/authService");
const todoService = require("./service/todoService");
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.lnthhmj.mongodb.net/todo-list?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/auth", authService);
app.use("/todo", todoService);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
