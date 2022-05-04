

const Sauce = require("../models/Sauce");

async function findLikes(sauceID, userID) {
    const obj = await Sauce.findOne({ _id: sauceID });
    return [obj.usersLiked.includes(userID), obj.usersDisliked.includes(userID)];
}

function getOBJUserLike(userID, isLike) {
    return isLike ? {usersLiked: userID} : {usersDisliked: userID};
}

function getOBJLike(isLike, add = true) {
    const n = add ? 1 : -1;
    return isLike ? {likes: n} : {dislikes: n};
}
async function addLike(sauceID, userID, isLike = true) {
    const [hasLiked, hasDisliked] = await findLikes(sauceID, userID);

    if (hasLiked || hasDisliked) throw new Error("ALREADY LIKED");

    return Sauce.updateOne({ _id: sauceID }, {
        $push: getOBJUserLike(userID, isLike),
        $inc:  getOBJLike(isLike),
    });
}

async function rmLike(sauceID, userID) {
    const [hasLiked, hasDisliked] = await findLikes(sauceID, userID);

    if (!hasLiked && !hasDisliked) throw new Error("NO LIKE");

    return Sauce.updateOne({ _id: sauceID }, {
        $pull: getOBJUserLike(userID, hasLiked),
        $inc: getOBJLike(hasLiked, false),
    });
}

exports.handleLikes = (req, res) => {
    const action = req.body.like
        ? addLike(req.params.id, req.body.userId, req.body.like > 0)
        : rmLike(req.params.id, req.body.userId);

    action.then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch(err => {
            console.error(err);
            res.status(400).end();
        });
}

