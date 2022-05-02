

const Sauce = require("../models/Sauce");

async function findLikes(sauceID, userID) {
    const obj = await Sauce.findOne({ _id: sauceID });
    return [obj.usersLiked.includes(userID), obj.usersDisliked.includes(userID)];
}

function getOBJUserLike(userID, isLike) {
    return isLike ? {usersLiked: userID} : {usersDisliked: userID};
}

function getOBJLike(isLike, add = true) {
    return isLike ? {likes: add ? 1 : -1} : {dislikes:  add ? 1 : -1};
}

async function pushLike(sauceID, userID, isLike = true) {
    const [hasLike, hasDislike] = await findLikes(sauceID, userID);

    if (hasLike || hasDislike) throw new Error("ALREADY LIKED");

    return Sauce.updateOne({ _id: sauceID }, {
        $push: getOBJUserLike(userID, isLike),
        $inc:  getOBJLike(isLike),
    });
}

async function rmLike(sauceID, userID) {
    const [hasLike, hasDislike] = await findLikes(sauceID, userID);

    if (!hasLike && !hasDislike) throw new Error("NO LIKE");

    return Sauce.updateOne({ _id: sauceID }, {
        $pull: getOBJUserLike(userID, hasLike),
        $inc: getOBJLike(hasLike, false),
    });
}

exports.addLikeOrDislike = (req, res) => {
    const action = req.body.like
        ? pushLike(req.params.id, req.body.userId, req.body.like > 0)
        : rmLike(req.params.id, req.body.userId);

    action.then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch(err => {
            console.error(err);
            res.status(400).end();
        });
}

