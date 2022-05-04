const { verify } = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const bearer = req.get("Authorization");
        if (!bearer) throw new Error("Request without token");
        const token = bearer.split(" ")[1];
        const decodedToken = verify(token, process.env.SECRET_JWT);
        req.user = { ...decodedToken };
        next();
    } catch (error) {res.status(401).json({ message: "Unauthorized", error: error.message })};
};