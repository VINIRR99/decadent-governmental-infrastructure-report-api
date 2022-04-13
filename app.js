require("dotenv").config();

const connectDb = require("./configs/db.config");
connectDb();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());

const corsOptions = {
    credentials: true,
    origin: [process.env.ACCESS_CONTROL_ALLOW_ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE"]
};

app.use(cors(corsOptions));

app.use("/auth", require("./routes/public/auth-routes"));
app.use("/user", require("./routes/public/user-route"));
app.use("/reports", require("./routes/public/report.route"));

app.use(require("./middlewares/auth.middleware"));

app.use("/reports", require("./routes/private/report-routes"));
app.use("/comment", require("./routes/private/comment-routes"));

app.listen(process.env.PORT, () => console.log(`Server running on port: ${process.env.PORT}
corsOptions:`, corsOptions));