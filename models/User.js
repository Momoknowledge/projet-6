const mongoose = require('mongoose'); // facilite les taches d'écritures et de lectures
const uniqueValidator = require('mongoose-unique-validator'); // pour empêcher de s'inscrire plusieurs utilisateurs avec la meme adresse mail.
const diffHistory = require('mongoose-diff-history/diffHistory'); //ajoute une historique plugin pour mongoose

const userSchema = mongoose.Schema({
//id: { type: String, required: true },
    email: {type: String, required: true, unique: true}, // unique qui permet de ne pas utiliser la meme adresse mail.
    password: {type: String, required: true},
});

userSchema.plugin(uniqueValidator);

//utilisation mongoose historique pour créer des journaux dans la base de données
userSchema.plugin(diffHistory.plugin);

module.exports = mongoose.model("User", userSchema);