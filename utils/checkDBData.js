const Database = require("@replit/database")

const db = new Database()

db.list().then(keys => {
    console.log("All keys", keys)
    keys.forEach(key => {
        db.get(key).then((data) => {
            if (Array.isArray(data)) {
                for (const travel of data) {
                    console.log(travel)
                }
            }else {
                console.log(data)
            }
        })
    })
});