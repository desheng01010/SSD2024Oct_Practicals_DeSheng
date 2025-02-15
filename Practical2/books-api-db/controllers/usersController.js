const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const e = require("express");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving users");
  }
};

const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving user");
  }
};

const createUser = async (req, res) => {
  const newBook = req.body;
  try {
    const createdUser = await User.createUser(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating user");
  }
};

const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedUser = req.body;

  try {
    const updatedUser = await User.updateUser(userId, updatedUser);
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user");
  }
};

const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const success = await User.deleteUser(userId);
    if (!success) {
      return res.status(404).send("User not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting user");
  }
};

async function searchUsers(req, res) {
  const searchTerm = req.query.searchTerm; // Extract search term from query params

  try {
    const users = await User.searchUsers(searchTerm);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching users" });
  }
}

async function getUsersWithBooks(req, res) {
  try {
    const users = await User.getUsersWithBooks();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users with books" });
  }
}

async function registerUser(req, res) {
  const { username, email, password, role } = req.body;
  console.log("registerUser: ", username, password, role);

  try {
    const existingUser = await User.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      email,
      hashedPassword: hashPassword,
      role,
    };

    const createdUser = await User.createUser(newUser);
    return res.status(201).json(createdUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  console.log("login: ", username, password, salt);

  try {
    // Validate user credentials
    const existingUser = await User.getCountByUsername(username);
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password with hash
    const isMatch = await bcrypt.compare(password, existingUser.hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = {
      id: existingUser.id,
      role: existingUser.role,
    };
    const token = jwt.sign(payload, "your_secret_key", { expiresIn: "3600s" }); // Expires in 1 hour

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers,
  getUsersWithBooks,
  registerUser,
  login,
};
