const multer = require('multer'); //package de gestion de fichiers

//pour générer l'extension des fichiers
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png':'png',
};

const ID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 *
 * @param size
 * @returns {string}
 */
function generateLightID(size) {
    let id = '';
    for (let i = 0; i < size; i++) {
        id += ID_CHARS.charAt(Math.floor(Math.random() * ID_CHARS.length)); // génère un caractère avec un nombre aléatoire sur la base de ID_CHARS entre 0 et 61
    }

    return id;
}

//configure le chemin et le nom de fichier pour les fichiers entrants
const storage = multer.diskStorage({
    destination: (req, file, callback) => {   // fonction pour expliquer multer quel dossier pour enregistrer le fichier
        callback(null, 'images')
    },
    filename: async (req, file, callback) => {  // fonction pour expliquer quel nom de fichier utiliser
        const ext = MIME_TYPES[file.mimetype];
        const randID = generateLightID(12);
        callback(null, `${randID}.${ext}`);
    }
});

module.exports = multer({storage}).single('image');