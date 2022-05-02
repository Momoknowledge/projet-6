
const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");




//deux routes Posts le frontend va envoyer l'adresse mail et le password
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);


module.exports = router;