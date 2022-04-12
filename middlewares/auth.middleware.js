const { verify } = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const bearer = req.get("Authorization");
        if (!bearer) {
            const error = new Error("Authorization token not found!");
            error.status = 401;
            throw error;
        };

        const token = bearer.split(" ")[1];
        const decodedToken = verify(token, process.env.SECRET_JWT);

        req.user = { ...decodedToken };
        next();
    } catch (error) {
        if (!error.status) error.status = 500;
        res.status(error.status).json({ message: "Error in authorization middleware!", error: error.message });
    };
};