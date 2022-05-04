const {DB_USER, DB_PASSWORD, DB_URL, ALLOWED_ORIGINS} = require("./config");

const express = require('express'); //importe express
const mongoose = require('mongoose');// facilite les interactions entre l'application Express et la base de données MongoDB
const saucesRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user');
const app = express(); //Il prend en charge les détails essentiels du backend tels que les sessions, le traitement des erreurs et le routage
const bodyParser = require("body-parser"); //analyse les corps de toutes les requêtes entrantes disponible sous la propriété req.body

// connexion to mongoDB
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URL}`)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(err => {
        console.error('Connexion à MongoDB échouée !');
        throw err;
    });

mongoose.connection.on('error', err => { throw err });


//middlewaire generale qui sera appliqué a toutes les requêtes envoyées au serveur, permet à l'application d'accéder à api

app.use(/^(?!\/images\/)/,(req, res, next) => {
    // Le CORS définit comment le serveur et le navigateur interagissent, en spécifiant quelles ressources peuvent être demandées de manière légitime
    if (!ALLOWED_ORIGINS.includes(req.headers.origin)) {
        res.status(403).end();
        return;
    }
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin); // D'où peut on accéder à l'api
    res.setHeader('Vary', "Origin, Content-Type"); // varie suivant l'origine de http
    if (req.method === "OPTIONS") {
        res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');//d'envoyer des requêtes avec les méthodes mentionnées.
        res.setHeader('Access-Control-Max-Age', '86400');//maximum autoriser 24h.
    }
    next();
});

//prevent attack Dos ayant pour but de rendre indisponible un service, d'empêcher les utilisateurs légitimes d'un service de l'utiliser
app.use(express.json({ limit: '10kb' })); // Body limit est 10kb, intercepte toutes les requêtes qui ont un content-type json
// pour mettre à disposition ce corps de la requête dans req.body

app.use(bodyParser.json());
app.use('/api/auth',userRoutes);
app.use("/api/sauces", saucesRoutes);

app.use("/images",express.static('images'));
module.exports = app;