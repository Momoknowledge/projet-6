
const express = require('express'); //importe express
const mongoose = require('mongoose');// facilite les interactions entre l'application Express et la base de données MongoDB
const saucesRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user');
const app = express(); //Il prend en charge les détails essentiels du backend tels que les sessions, le traitement des erreurs et le routage
const bodyParser = require("body-parser"); //analyse les corps de toutes les requêtes entrantes disponible sous la propriété req.body

// connexion to mongoDB
mongoose.connect('mongodb+srv://momoUser32:UsVBHOg8PWJbczAI@cluster0.l5tyt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(err => {
        console.error('Connexion à MongoDB échouée !');
        throw err;
    });

mongoose.connection.on('error', err => { throw err });


//middlewaire generale qui sera appliqué a toutes les requêtes envoyées au serveur
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // d'accéder à notre API depuis n'importe quelle origine,
    // Le CORS définit comment le serveur et le navigateur interagissent, en spécifiant quelles ressources peuvent être demandées de manière légitime
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //d'ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');//d'envoyer des requêtes avec les méthodes mentionnées.
    next();
});

//prevent attack Dos ayant pour but de rendre indisponible un service, d'empêcher les utilisateurs légitimes d'un service de l'utiliser
app.use(express.json({ limit: '10kb' })); // Body limit is 10kb

app.use(bodyParser.json());
app.use('/api/auth',userRoutes);
app.use("/api/sauces", saucesRoutes);

app.use("/images",express.static('images'))
module.exports = app;