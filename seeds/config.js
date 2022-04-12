require("dotenv").config();

const { connect } = require("mongoose");
const plantSeeds = require("./seeds");

const connectDB = async () => {
    try {
        const { connections, disconnect } = await connect(process.env.MONGODB_URI);
        console.log(`Connected to the database: ${connections[0].name}`);
        return disconnect;
    } catch (error) {throw { message: "Error while trying to connect to the database", error: error.message }};
};

const run = async () => {
    const disconnect = await connectDB();
    try {
        await plantSeeds();
    } catch (error) {
        disconnect();
        console.error(error);
    } finally {
        disconnect();
        console.log("Disconnected from the database");
    };
};

run();