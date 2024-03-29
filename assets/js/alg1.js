// Emotional Support Algorithm 1 - Revision 0.0.7
// Returns:
// Score   - score student got in their test (0-100)
// emStab  - emotional stability (low/high)
// consi   - conscientiousness (low/high)

// Emotional Support Statements

const emSupStatements = {
	P: ['That was hard but you did it.', 'I am proud of you.', 'Well done.'],
	ER: [
		"I know what you're feeling.",
		'You must be really happy.',
		'I understand that you may be upset.',
	],
	R: [
		'Everyone is wrong sometimes.',
		'Everyone finds this hard.',
		'You will get the hang of it eventually.',
	],
	A: [
		'Just keep practising.',
		'Just take a bit longer next time.',
		'Just read the questions more carefully.',
	],
};

/**
 * This functions rounds the learners score so that it can be used with
 * the algorithm.
 *
 * @param {Number} score - The score the learner achieved
 * @returns {Number} roundedScore - Rounded score to be used by algorithm
 */
function handleScore(score) {
	let roundedScore;

	if (score < 15) {
		roundedScore = 10;
	} else if (score < 40) {
		roundedScore = 30;
	} else if (score >= 40 && score < 50) {
		roundedScore = 45;
	} else if (score >= 50 && score < 65) {
		roundedScore = 55;
	} else if (score >= 65 && score <= 70) {
		roundedScore = 70;
	} else if (score > 70 && score < 80) {
		roundedScore = 70;
	} else if (score >= 80) {
		roundedScore = 90;
	}
	return roundedScore;
}

/**
 * The algorithm - first rendition
 *
 * @param {Number} score - Score learner achieved
 * @param {Object} personalityData - Learner personality data
 * @returns {Object} feedbackData - Object containing feedback statement and slant
 */
function getFeedback(score, personalityData) {
	let slant;
	let ES;
	switch (handleScore(score)) {
		case 10:
			slant = 'neutral';
			personalityData.emotionalStability == 'low'
				? (ES = ['ER', 'R', 'A'])
				: (ES = ['R', 'A']);
			break;
		case 30:
			personalityData.emotionalStability == 'low'
				? (ES = ['ER', 'R', 'A'])
				: (ES = ['R', 'A']);
			personalityData.conscientiousness == 'low' &&
			personalityData.emotionalStability != 'low'
				? (slant = 'negative')
				: (slant = 'neutral');
			break;
		case 45:
			slant = 'neutral';
			ES = ['R', 'A'];
			break;
		case 55:
			slant = 'neutral';
			personalityData.conscientiousness == 'high'
				? (ES = ['P', 'A'])
				: (ES = ['R', 'A']);
			break;
		case 70:
			personalityData.conscientiousness == 'low' ? (ES = ['A']) : (ES = ['P']);
			personalityData.conscientiousness == 'low' &&
			personalityData.emotionalStability != 'low'
				? (slant = 'negative')
				: (slant = 'neutral');
			break;
		case 90:
			slant = 'neutral';
			personalityData.conscientiousness == 'low'
				? (ES = ['P', 'P'])
				: (ES = ['P']);
	}

	const feedbackData = {
		score,
		ES,
		slant,
	};

	const feedbackString = createFeedbackArray(feedbackData);

	return feedbackString;
}

/**
 * Gets random statements and pushes them into array.
 *
 * @param {Object} data - feedback data object
 * @returns {Array} feedbackArr - array containing filtered statements
 */
function createFeedbackArray(data) {
	const feedbackArr = [];

	data.ES.forEach(statement => {
		Object.keys(emSupStatements).forEach(key => {
			if (statement === key) {
				feedbackArr.push(
					emSupStatements[key][
						Math.floor(Math.random() * emSupStatements[key].length)
					]
				);
			}
		});
	});
	return createFeedbackString(feedbackArr);
}

/**
 * Removes duplicates if present and converts feedback array to a human-readable
 * string.
 *
 * @param {Array} feedbackArr - Array containing feedback statements
 * @returns {String} feedbackString - feedback string to be displayed on page
 */
function createFeedbackString(feedbackArr) {
	const arrNoDuplicates = [...new Set(feedbackArr)];
	let feedbackString = '';
	arrNoDuplicates.forEach(sentence => {
		feedbackString += `${sentence} `;
	});
	return feedbackString;
}
