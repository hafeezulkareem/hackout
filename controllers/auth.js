const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { expressjwt: expressJWT } = require("express-jwt");
const { v4: uuid } = require('uuid');
const crypto = require("crypto")

const { getKey, setKey } = require("../utils/db")

const getEncryptedPassword = (password, salt) => crypto
    .createHmac("sha256", salt)
    .update(password)
    .digest("hex");

exports.signUp = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ message: errors.array()[0].msg });
    }

    const { email, name, password } = req.body
    getKey(email).then((user) => {
        if (user !== null) {
            return res.status(400).json({ message: "Account with given email is already exists" });
        }

        const salt = uuid();
        const encryptedPassword = getEncryptedPassword(password, salt)
        setKey(email, { name, email, salt, encryptedPassword }).then(() => {
            return res.status(201).json({ message: "Account created successfully" })
        }).catch((error) => {
            return res.status(400).json({ message: error.message })
        })

    }).catch((error) => {
        return res.status(400).json({ message: error.message })
    })
};

exports.signIn = (req, res) => {
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) {
        return res.status(422).json({ message: errors.array()[0].msg });
    }

    const { email, password } = req.body;
    getKey(email).then((user) => {
        if (user === null) {
            return res.status(400).json({ error: "User doesn't exist with the email" });
        }

        const { name, salt, encryptedPassword } = user
        const currentEncryptedPassword = getEncryptedPassword(password, salt)
        if (encryptedPassword !== currentEncryptedPassword) {
            return res
                .status(401)
                .json({ error: "Email and password doesn't match" });
        }

        const token = jwt.sign({ email }, process.env['SECRET']);
        res.cookie("token", token, { expire: new Date() + 604800 });

        return res.status(200).json({ token, name });
    });
};

exports.signOut = (_, res) => {
    res.clearCookie("token");
    return res.status(200).json({
        message: "User signed out successfully",
    });
};

exports.getUserProfile = (req, res) => {
    const bearer = req.headers['authorization']
    if (bearer) {
        const [_, token] = bearer.split(' ')
        const { email } = jwt.verify(token, process.env['SECRET'])
        getKey(email).then((user) => {
            const {email, name} = user
            return res.status(200).json({email, name})
        }).catch((error) => {
            return res.status(400).json({ message: error.message })
        })
    }
}

exports.isSignedIn = expressJWT({
    secret: process.env['SECRET'],
    userProperty: "auth",
    algorithms: ["sha1", "RS256", "HS256"],
});

exports.isAuthenticated = (req, res, next) => {
    const isAuthenticated =
        req.profile && req.auth && req.profile._id == req.auth._id;
    if (!isAuthenticated) {
        return res.status(403).json({ error: "Access denied" });
    }
    next();
};
