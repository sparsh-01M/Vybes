// // authRoutes.js
// const express = require('express');
// const passport = require('passport');
// const router = express.Router();
// const User = require('../models/User');

// router.get('/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// router.get('/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   (req, res) => {
//     res.redirect(process.env.FRONTEND_URL);
//   }
// );

// router.get('/check', (req, res) => {
//   if (req.user) {
//     res.json({ user: req.user });
//   } else {
//     res.status(401).json({ user: null });
//   }
// });

// router.post('/logout', (req, res) => {
//   req.logout();
//   res.clearCookie('connect.sid');
//   res.status(200).json({ message: 'Logged out' });
// });

// module.exports = router;
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();
const router = express.Router();

// Google One Tap Verification Route
router.post("/google-one-tap", async (req, res) => {
  try {
    const { credential } = req.body;

    // Verify the Google JWT
    const decodedToken = jwt.decode(credential);

    if (!decodedToken) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const { sub, name, email, picture } = decodedToken;

    let user = await User.findOneAndUpdate(
      { googleId: sub },
      { displayName: name, email, avatar: picture },
      { upsert: true, new: true }
    );

    // Generate JWT token for session management
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.json({ user, token });
  } catch (error) {
    console.error("Google One Tap Error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.status(200).json({ message: "Logged out" });
});

// Google Auth Routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account", // Force account selection
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication
    res.redirect(process.env.FRONTEND_URL);
  }
);

export default router;
