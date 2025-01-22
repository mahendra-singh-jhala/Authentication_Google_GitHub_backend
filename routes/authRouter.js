const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");

router.get("/auth/google", authController.loginWithGoogle);
router.get("/auth/google/callback", authController.GoogleCallback)

router.get("/auth/github", authController.loginWithGitthub);
router.get("/auth/github/callback", authController.GithubCallback)


module.exports = router