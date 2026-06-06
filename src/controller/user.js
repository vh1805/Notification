const jwtService = require("../jwt/jwtService");
const User = require("../model/user");
const PublisherFactory = require("../RabbitMQ/publisherFactory");
const { validateUser } = require("../validation/authValidation");

async function login(req, res) {
  const { email, password, name } = req.body;
  const error = validateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }
  try {
    const isUserExist = await User.findOne({ email });
    if (!isUserExist) {
      return res.status(404).json({ message: "User not found" });
    }
    if (isUserExist.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwtService.generateToken(isUserExist);
    res.status(200).json({ message: "Login successful", token, isUserExist });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function register(req, res) {
  const { email, password, name } = req.body;
  const error = validateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }
  try {
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(409).json({ message: "User already exists" });
    }
    const newUser = new User({ email, password, name });
    await newUser.save();

    try {
      const delayMs = 30000 + Math.floor(Math.random() * 30000);
      const emailPublisher = await PublisherFactory.create("EMAIL");
      await emailPublisher.publish({ email, name }, { delayMs });
    } catch (err) {
      console.error("RabbitMQ error:", err);
    }

    res.status(201).json({ message: "User registered successfully", newUser });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { login, register };
