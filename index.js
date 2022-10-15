const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");


const authRoutes = require("./routes/auth")
const travelRoutes = require("./routes/travel")


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());


app.use("/", authRoutes);
app.use("/", travelRoutes);

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

