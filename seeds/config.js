require("dotenv").config();

const { connect } = require("mongoose");
const plantSeeds = require("./seeds");

const connectDB = async () => {
    try {
        const { connections, disconnect } = await connect(process.env.MONGODB_URI);
        console.log(`Connected to the database: ${connections[0].name}`);
        return disconnect;
    } catch (error) {console.error("Error while connecting to the databse", error)};
};

const run = async () => {
    const disconnect = await connectDB();
    try {
        await plantSeeds();
    } catch (error) {
        console.error(error);
    } finally {
        disconnect();
        console.log("Disconnected from the database");
    };
};

run();