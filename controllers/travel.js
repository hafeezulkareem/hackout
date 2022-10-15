const { validationResult } = require("express-validator");
const { v4: uuid } = require('uuid');

const { getKey, setKey } = require("../utils/db")

exports.addTravel = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ message: errors.array()[0].msg });
    }

    const { email, name, duration, from, to, type } = req.body
    const id = uuid()
    getKey('travels').then((data) => {
        const travels = []
        const newTravel = { id, email, name, duration, from, to, type, requests: {} }
        if (data === null) {
            travels.push(newTravel)
        } else {
            travels.push(...data, newTravel)
        }
        setKey('travels', travels).then(() => {
            return res.status(200).json({ message: "Travel added successfully" })
        }).catch((error) => {
            return res.status(400).json({ message: error.message })

        })
    }).catch((error) => {
        return res.status(400).json({ message: error.message })
    })
}

exports.getTravels = (_, res) => {
    getKey("travels").then((travels) => {
        return res.status(200).json({ travels })
    }).catch((error) => {
        return res.status(400).json({ message: error.message })
    })
}

exports.addTravelRequest = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ message: errors.array()[0].msg });
    }

    const { id, email } = req.body
    getKey("travels").then((travels) => {
        let isTravelValid = false;
        const updatedTravels = travels.map(travel => {
            const { requests } = travel
            if (email in requests) {
                return res.status(400).json({ message: "Already requested for this travel" })
            }
            if (travel.id === id) {
                isTravelValid = true;
                requests[email] = false
                return { ...travel, requests }
            } else {
                return travel;
            }
        })
        if (!isTravelValid) {
            return res.status(200).json({ message: "Travel is not present with the given id" })
        }
        setKey("travels", updatedTravels).then(() => {
            return res.status(200).json({ message: "Request added successfully" })
        }).catch((error) => {
            return res.status(400).json({ message: error.message })
        })
    }).catch((error) => {
        return res.status(400).json({ message: error.message })
    })
}

exports.acceptTravelRequest = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ message: errors.array()[0].msg });
    }

    const { id, email } = req.body
    getKey("travels").then((travels) => {
        let isTravelValid = false;
        const updatedTravels = travels.map(travel => {
            const { requests } = travel
            if (!(email in requests)) {
                return res.status(400).json({ message: "Request is not present to accept with the given email" })
            }
            if (travel.id === id) {
                isTravelValid = true;
                requests[email] = true
                return { ...travel, requests }
            } else {
                return travel;
            }
        })
        if (!isTravelValid) {
            return res.status(200).json({ message: "Travel is not present with the given id" })
        }
        setKey("travels", updatedTravels).then(() => {
            return res.status(200).json({ message: "Request accepted successfully" })
        }).catch((error) => {
            return res.status(400).json({ message: error.message })
        })
    }).catch((error) => {
        return res.status(400).json({ message: error.message })
    })
}