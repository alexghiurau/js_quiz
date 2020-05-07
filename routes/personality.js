const express = require('express');

const router = express.Router();
const User = require('../models/User');

// get personality from mongodb (user collection)

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getUser(req, res, next) {
	let user;
	try {
		user = await User.findById(req.params.id);
		if (user == null) {
			return res.status(404).json({ message: 'cannot find user' });
		}
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
	res.user = user;
	next();
}

router.get('/:id', getUser, (req, res) => {
	// if (req.user.id === req.params.id) {
	res.send(res.user);
	// } else {
	// res.status(404).json({ message: "access denied" });
	// }
});

router.patch('/:id', getUser, async (req, res) => {
	// if (req.user.id === req.params.id) {
	if (
		req.body.extraversion != null &&
		req.body.agreeableness != null &&
		req.body.conscientiousness != null &&
		req.body.emotionalStability != null &&
		req.body.opennessToExperience != null
	) {
		res.user.personality.extraversion = req.body.extraversion;
		res.user.personality.agreeableness = req.body.agreeableness;
		res.user.personality.conscientiousness = req.body.conscientiousness;
		res.user.personality.emotionalStability = req.body.emotionalStability;
		res.user.personality.opennessToExperience = req.body.opennessToExperience;
	}
	try {
		const updatedUser = await res.user.save();
		res.json(updatedUser);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
	// } else {
	// res.status(404).json({ message: "access denied" });
	// }
});

module.exports = router;
