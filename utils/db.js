const Database = require("@replit/database")

const db = new Database()

exports.getKey = (key) => db.get(key)

exports.setKey = (key, value) => db.set(key, value)
