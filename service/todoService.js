const express = require("express");
const router = express.Router();
const Todo = require("../models/todo");

router.get("/gettodo", async (req, res) => {
  try {
    const Todos = await Todo.find();
    res.status(200).json(Todos);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Gettodo is failed" });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { user_id, title, desc, status, finishAt } = req.body;
    const newTodo = new Todo({
      user_id,
      title,
      desc,
      status,
      finishAt,
    });
    const saveTodo = await newTodo.save();
    res.status(200).json(saveTodo);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Todo create is faile" });
  }
});

router.put("/update", async (req, res) => {
  try {
    const { _id, title, desc, status, finishAt } = req.body;
    const updateTodo = await Todo.findByIdAndUpdate(
      _id,
      { title, desc, status, finishAt },
      { new: true }
    );
    if (!updateTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    return res.status(200).json(updateTodo);
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ message: "Failed to update todo" });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const { id } = req.query;
    const deleteTodo = await Todo.findByIdAndDelete(id);
    if (!deleteTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    return res.status(200).json({ message: `Todo _id:${id} deleted` });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Todo delete is failed" });
  }
});

router.get("/gettodobyuserid", async (req, res) => {
  try {
    const { id } = req.query;
    const todos = await Todo.find({ user_id: id });
    if (!todos) {
      return res.status(404).json({ message: "Todo not found" });
    }
    return res.status(200).json(todos);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Gettodobyuserid is failed" });
  }
});

router.put("/updatestatus", async (req, res) => {
  try {
    const { id, status } = req.body;
    const updateTodo = await Todo.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updateTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    return res.status(200).json({ message: `Todo _id:${id} update` });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ message: "Failed to update todo" });
  }
});

module.exports = router;
