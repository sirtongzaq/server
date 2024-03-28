const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  status: { type: String, required: true, default: "active" },
  finishAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Todo", todoSchema);
