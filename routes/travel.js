const express = require("express");
const { check } = require("express-validator")

const { addTravel, getTravels, addTravelRequest, acceptTravelRequest } = require("../controllers/travel")
const { isSignedIn } = require("../controllers/auth")
const { DATE_FORMAT } = require("../constants")

const router = express.Router()

router.post(
    "/travel",
    [
        check("email", "A valid email is required").isEmail(),
        check("name", "Name should be at least 3 characters").isLength({
            min: 3,
        }),
        check("duration.from", "Travel start date is invalid").isDate({ format: DATE_FORMAT }),
        check("duration.to", "Travel end date is invalid").isDate({ format: DATE_FORMAT }),
        check("from", "Travel from location is required").isLength({ min: 1 }),
        check("to", "Travel to location is required").isLength({ min: 1 }),
        check("type", "Travel type is required").isLength({ min: 1 })
    ],
    isSignedIn,
    addTravel
);

router.get("/travels", isSignedIn, getTravels);

router.post("/travel/request/add", [
    check("id", "Travel id is required").isLength({ min: 1 }),
    check("email", "Joiner email is invalid").isEmail()],
    isSignedIn, addTravelRequest)

router.post("/travel/request/accept", [
    check("id", "Travel id is required").isLength({ min: 1 }),
    check("email", "Joiner email is invalid").isEmail()], isSignedIn, acceptTravelRequest)

module.exports = router