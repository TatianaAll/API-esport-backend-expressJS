// Create a middleware to authenticate users based on JWT tokens
// This will allow us to retrieve the client's token value and verify its validity, and also retrieve information such as the userId.
// First, we must split the token and then use the verify() method from jwt.
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      res.status(401).json({ message: "Pas de jetons d'authentification fourni" });
    } else {
      // Split the token because it is composed of Bearer before
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // The req/request object is passed to the routes that will be called
      // so we create an auth object here with the userId as information
      req.auth = {
        userId: decodedToken.userId,
        role: decodedToken.role,
      };
      // If everything goes well, we pass to the next code with next
      next();
    }
  } catch (error) {
    res.status(401).json({ error });
  }
};