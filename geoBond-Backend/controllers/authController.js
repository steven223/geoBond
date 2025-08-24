const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, passwordHash: hashedPassword });
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
  try {
    const user = await User.findById(req.user._id).select("-passwordHash");
    
    if (!user) {
      return res.status(404).json({ 
        status: "error",
        message: "User not found" 
      });
    }

    res.json({
      status: "success",
      data: user
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ 
      status: "error",
      message: "Server error while fetching profile" 
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { 
      fullName, 
      phone, 
      bio, 
      dob, 
      gender, 
      location,
      profileImageUrl 
    } = req.body;

    // Validate input data
    const updateData = {};
    
    if (fullName !== undefined) {
      if (!fullName || fullName.trim().length < 2) {
        return res.status(400).json({ 
          status: "error",
          message: "Full name must be at least 2 characters long" 
        });
      }
      updateData.fullName = fullName.trim();
    }

    if (phone !== undefined) {
      if (phone && !/^\+?[\d\s\-\(\)]{10,}$/.test(phone)) {
        return res.status(400).json({ 
          status: "error",
          message: "Please enter a valid phone number" 
        });
      }
      updateData.phone = phone;
    }

    if (bio !== undefined) {
      if (bio && bio.length > 500) {
        return res.status(400).json({ 
          status: "error",
          message: "Bio must be less than 500 characters" 
        });
      }
      updateData.bio = bio;
    }

    if (dob !== undefined) {
      if (dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (isNaN(birthDate.getTime()) || age < 13 || age > 120) {
          return res.status(400).json({ 
            status: "error",
            message: "Please enter a valid date of birth (age must be between 13-120)" 
          });
        }
        updateData.dob = birthDate;
      } else {
        updateData.dob = null;
      }
    }

    if (gender !== undefined) {
      if (gender && !['male', 'female', 'other'].includes(gender)) {
        return res.status(400).json({ 
          status: "error",
          message: "Gender must be male, female, or other" 
        });
      }
      updateData.gender = gender;
    }

    if (location !== undefined) {
      if (location && typeof location === 'object') {
        updateData.location = {
          city: location.city || '',
          state: location.state || '',
          country: location.country || ''
        };
      } else {
        updateData.location = null;
      }
    }

    if (profileImageUrl !== undefined) {
      updateData.profileImageUrl = profileImageUrl;
    }

    // Update user profile
    const user = await User.findByIdAndUpdate(
      req.user._id, 
      updateData, 
      { 
        new: true,
        runValidators: true 
      }
    ).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ 
        status: "error",
        message: "User not found" 
      });
    }

    res.json({ 
      status: "success",
      message: "Profile updated successfully", 
      data: user 
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ 
      status: "error",
      message: "Server error while updating profile" 
    });
  }
};

exports.updateLocation = async (req, res) => {
  const { lat, lng } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, {
    lastKnownLocation: { lat, lng, timestamp: new Date() }
  }, { new: true });
  res.json({ message: "Location updated", user });
};

exports.getAllUsers = async (req, res) => {
  try {
    let { search } = req.query;
    const filter = search
      ? { email: { $regex: search, $options: "i" } }
      : {};
    const users = await User.find(filter).select("-passwordHash");
    res.json({
      status: "success",
      data: users
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-passwordHash");
    
    if (!user) {
      return res.status(404).json({ 
        status: "error",
        message: "User not found" 
      });
    }

    res.json({
      status: "success",
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      status: "error",
      message: "Server error" 
    });
  }
};