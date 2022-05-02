//middleware  d'authentification
const jwt = require('jsonwebtoken'); // vérifie les tokens

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // récupérer le token dans le header autorisation,
        // avec un split qui retourne un beaer en premier element et le token en deuxième element
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId; // decoder le token prendre le User id qui est dedans
        if (req.body.userId && req.body.userId !== userId) {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Invalid user ID');
        }
        req.auth = decodedToken
        next()
    } catch (error) {
        console.error(error);
        res.status(401).end();
    }
};