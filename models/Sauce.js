
// facilite les interactions entre l'application Express et la base de données MongoDB
const mongoose = require('mongoose');


//ajoute l'historique des plugins pour mongoose
const diffHistory = require('mongoose-diff-history/diffHistory');

// permet de créer un schéma de données pour la base de données MongoDB.
const sauceSchema = mongoose.Schema({
    //id: { type: String, required: true }, //Généré par mongoose?
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: String, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: [{ type: String }],
    usersDisliked: [{ type: String }],
})


// Aide à suivre toutes les modifications apportées à un objet depuis le début et collecte
sauceSchema.plugin(diffHistory.plugin);


module.exports = mongoose.model("Sauce", sauceSchema);