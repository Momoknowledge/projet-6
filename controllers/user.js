const jwt = require('jsonwebtoken');//package pour créer des tokens et de les verifier
const User = require('../models/User');
const bcrypt = require('bcrypt');//package de hachage de  mot passe
const Joi = require("joi"); // permet de filtrer les entrées dans la base de données

const signupSchema = Joi.object({
    email: Joi.string().max(120).email().trim(),
    password: Joi.string().min(3).max(255)
});

//Enregistrement utilisateur dans la base de données
exports.signup = async (req, res) => {
        try {
            const data = await signupSchema.validateAsync(req.body); //Attendre la validation du corps de la requête avec le Schema Joi
            const hash = await bcrypt.hash(data.password, 10);// mot de pass haché avec le hash créé par bcrypt et un sél de 10 tours pour l'algorithme
            const user = new User({
                email: data.email,
                password: hash
            })
            await user.save()
            res.status(201).json({message: 'utilisateur créé !'})
        } catch (err) {
            console.error(err);
            res.status(400).end()
        }
};

//utilisateurs existants de se connecter
exports.login = (req, res) => {
    User.findOne({email: req.body.email}).then(user => {
        bcrypt.compare(req.body.password, user?.password).then(valid => {
            if (!user || !valid) {
                return res.status(401).json({error: 'mot de passe incorrect!'});
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    {userId: user._id}, // encodage identifiant de l'utilisateur
                    'RANDOM_TOKEN_SECRET', // Pour encoder notre token (à remplacer par une chaîne aléatoire beaucoup plus longue pour la production) ;
                    {expiresIn: '24h'} // une expiration du token 24 h
                )
            });
        }).catch(error => res.status(500).json({error}));
    }).catch(error => res.status(500).json({error}));
};

//calcule de la puissance mot de passe

exports.checkPassword = password => {

    let base = 0
    if (/[A-Z]/.test(password)) base += 26;
    if (/[a-z]/.test(password)) base += 26;
    if (/\d/.test(password)) base += 10; // si c'est un nombre ajoute 10 a la base
    if (/[^a-zA-Z\d]/.test(password)) base += 12; // s'il contient un caractère special il ajoute 12

    const strength = Math.log2(Math.pow(base,password.length));

    //console.log(strength)
    return strength > 64;


}

