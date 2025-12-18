// On va créé un dossier middleware avec dedans un fichier auth.js pour gérer notre authentification.
// Cela va permettre de récupérer la valeur du Token du client et de vérifier la validité et permettra de récupérer des infos comme le userId.
//Tout d'abord on doit split le token puis on va utiliser la méthode verify() de jwt.
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      res.status(401).json({ message: "Pas de jetons d'authentification fourni" });
    } else {
      // On split le token car il est composé de Bearer avant
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;

      // l'objet req/request est transmis aux routes qui vont être appelées
      // on va donc créer un objet ici auth avec comme info l'id
      req.auth = {
        userId: userId,
      };
      // Si tout va bien, on passe au code suivant avec next
      next();
    }
  } catch (error) {
    res.status(401).json({ error });
  }
};