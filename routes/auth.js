const express = require("express");
const { check } = require("express-validator")

const { signUp, signIn, isSignedIn, getUserProfile, signOut } = require("../controllers/auth")

const router = express.Router()

router.post(
    "/sign-up",
    [
        check("name", "Name should be at least 3 characters").isLength({ min: 3 }),
        check("email", "A valid email is required").isEmail(),
        check("password", "Password should be at least 3 characters").isLength({ min: 3 }),
    ],
    signUp
);

router.post(
    "/sign-in",
    [
        check("email", "A valid is required").isEmail(),
        check("password", "Password is required").isLength({ min: 1 }),
    ],
    signIn
);

router.get(
    "/user",
    isSignedIn,
    getUserProfile
);

router.get("/sign-out", signOut);


module.exports = router