const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash: hashedPassword });
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ _id: user._id, isPaidUser: user.isPaidUser }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-passwordHash");
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const updateData = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true });
  res.json({ message: "Profile updated", user });
};

exports.updateLocation = async (req, res) => {
  const { lat, lng } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, {
    lastKnownLocation: { lat, lng, timestamp: new Date() }
  }, { new: true });
  res.json({ message: "Location updated", user });
};
