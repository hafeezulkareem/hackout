const Database = require("@replit/database")

const db = new Database()

db.list().then(keys => {
    keys.forEach(key => {
        db.delete(key).then((data) => {
            console.log(`Deleted ${key} profile`)
        }).catch(() => {
            console.log(`Unable to delete ${key} profile`)
        })
    })
});

db.delete("travels").then(() => {
    console.log("Travels deleted successfully")
}).catch((error) => {
    console.log(error.message)
})