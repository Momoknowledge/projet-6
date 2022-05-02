//Le CRUD(creat,read,delete,update) exporte des méthodes qui sont ensuite attribuées aux routes pour améliorer la maintenabilité de votre application.

const Sauce = require('../models/Sauce');
const fs = require('fs'); // expose des méthodes pour interagir avec le système de fichiers du serveur

//requête post pour la creation d'un objet
exports.createSauce = (req, res,) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id; //retire le champ de ID du corps de la requête avant de copier l'objet
    const sauce = new Sauce({
        ...sauceObject, //copie les champs qu'il y a dans le body de la request et détaille le titre, la description etc
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save() //enregistre l'objet dans la base de données
        .then(() => res.status(201).json({message: 'Objet enregistré !'}))// envoi une réponse dans le frontend
        .catch(error => res.status(400).json({error})); // récupère l'erreur et envoi un code 400
};

// recuperation d'un objet spécifique dans la base de données
exports.getOneSauce = (req, res,) => {
    Sauce.findOne({
        _id: req.params.id, // l'id de l'objet en vente soit le même le paramètre de la requête
    })
        .then((sauce) => {
            res.status(200).json(sauce);
        })
        .catch((error) => res.status(404).json({error: error}));
};

//requête get permet de récupérer des objets dans la base
exports.getAllSauces = (req, res,) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))// récupère tous objets retournés par la base de données
        .catch((error) => res.status(400).json({error: error})); //envoie une réponse
};

//Cette requête répond aux requêtes PUT
exports.modifySauce = (req, res,) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body};
    //Metre a jour un objet dans la base de données
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id}) // objet de comparaison premier argument
        // entre celui dont l'id égal à l'id qui est envoyé dans les paramètres de requêtes, le deuxième argument la nouvelle version de l'objet.
        //On utilise le spread operator pour récupérer l'objet qui est dans le corps de la requête, l'id correspond des paramètres
        .then(() => res.status(200).json({message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({error}));
};

exports.deleteSauce = async (req, res) => {
    try {
        const sauce = await Sauce.findOne({_id: req.params.id});
        if (!req.auth?.userId || sauce.userId !== req.auth.userId) {
            return res.status(401).json({error: 'Requête non autorisée'});
        }

        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, err => err && console.error(err)); // permet de supprimer un fichier du système de fichiers.

        await Sauce.deleteOne({_id: req.params.id})
        return res.status(200).json({message: 'Objet supprimé !'});
    } catch (err) {
        console.error(err)
        return res.status(400).end()
    }
};
