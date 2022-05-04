const { verify } = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const bearer = req.get("Authorization");
        const token = bearer.split(" ")[1];
        const decodedToken = verify(token, process.env.SECRET_JWT);
        req.user = { ...decodedToken };
        next();
    } catch (error) {res.status(401).json({ message: "Error in authorization middleware!", error: error.message })};
};