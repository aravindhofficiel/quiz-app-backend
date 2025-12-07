const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");

// Get all users (Admin)
exports.getUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Create Teacher (Admin)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role = "teacher" } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const existing = await UserModel.findByEmail(email);
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    await UserModel.createUser({
      name,
      email,
      password: hashed,
      role,
    });

    res.json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error creating user" });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await UserModel.deleteUser(id);

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
};
