import express from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./authMiddleware.js";

const app = express();
app.use(express.json());

// fake user
const USER = {
  email: "test@example.com",
  password: "123456"
};

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email !== USER.email || password !== USER.password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { email },
    "SECRET123",
    { expiresIn: "1h" }
  );

  res.json({ token });
});

app.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Protected Route", user: req.user });
});

app.listen(5000, () => console.log("Server running on port 5000"));
