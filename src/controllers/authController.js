const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const authController = {
  // REGISTER USER
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;

      // 1. Check if email exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // 2. Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3. Insert user
      const userId = await UserModel.createUser({
        name,
        email,
        password: hashedPassword,
        role: role || "student",
      });

      res.status(201).json({
        message: "User registered successfully",
        userId,
      });

    } catch (error) {
      console.error("Register Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // LOGIN USER
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // 1. Check if user exists
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // 2. Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // 3. Create JWT token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // 4. Send success response
      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });

    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
};

module.exports = authController;
