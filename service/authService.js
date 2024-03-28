const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/user");

router.get("/getuser", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Getuser is failed" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });
    const saveUser = await newUser.save();

    res.status(200).json(saveUser);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Regiser is failed" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Password mismatch" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });
    res.setHeader("Authorization", `Bearer ${token}`);
    return res.status(200).json({ message: "Login successful" });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: "Login failed" });
  }
});

router.get("/getuserbytoken", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }
  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    const userId = decoded.id;
    const userEXP = decoded.exp;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    return res.status(200).json({ user, userEXP });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Get user failed" });
  }
});

module.exports = router;
