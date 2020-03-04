// store userId of current user
let userId;

(async () => {
	// get userId of current user
	userId = await fetch('/api/user_data')
		.then(res => res.json())
		.then(data => data.id);

	const url = `/personality/${userId}`;
	const user = await fetch(url).then(res => res.json());

	if (
		user.personality.extraversion === 'n/a' ||
		user.personality.agreeableness === 'n/a' ||
		user.personality.conscientiousness === 'n/a' ||
		user.personality.emotionalStability === 'n/a' ||
		user.personality.opennessToExperience === 'n/a'
	) {
		$('#personalityModal').modal();
	}
})();

/**
 * If personality data not set, promt user to complete questionnaire.
 * Handles quistionnaire form, requiring user to complete all fields.
 *
 */
function handlePersonality() {
	const personalityArr = [];

	// ensure all questions were answered
	if (
		$('#extravertedSelect')[0].selectedIndex <= 0 ||
		$('#criticalSelect')[0].selectedIndex <= 0 ||
		$('#dependableSelect')[0].selectedIndex <= 0 ||
		$('#anxiousSelect')[0].selectedIndex <= 0 ||
		$('#openToExperiencesSelect')[0].selectedIndex <= 0 ||
		$('#reservedSelect')[0].selectedIndex <= 0 ||
		$('#sympatheticSelect')[0].selectedIndex <= 0 ||
		$('#disorganizedSelect')[0].selectedIndex <= 0 ||
		$('#calmSelect')[0].selectedIndex <= 0 ||
		$('#conventionalSelect')[0].selectedIndex <= 0
	) {
		window.alert('Ensure you answer all questions.');
	} else {
		// get rid of modal
		$('#personalityModal').modal('hide');

		// get values from personality modal form
		const extraverted = parseInt($('#extravertedSelect :selected').val(), 10);
		const critical = parseInt($('#criticalSelect :selected').val(), 10);
		const dependable = parseInt($('#dependableSelect :selected').val(), 10);
		const anxious = parseInt($('#anxiousSelect :selected').val(), 10);
		const open = parseInt($('#openToExperiencesSelect :selected').val(), 10);
		const reserved = parseInt($('#reservedSelect :selected').val(), 10);
		const sympathetic = parseInt($('#sympatheticSelect :selected').val(), 10);
		const disorganized = parseInt($('#disorganizedSelect :selected').val(), 10);
		const calm = parseInt($('#calmSelect :selected').val(), 10);
		const conventional = parseInt($('#conventionalSelect :selected').val(), 10);

		// push results into an array
		personalityArr.push(
			extraverted,
			critical,
			dependable,
			anxious,
			open,
			reserved,
			sympathetic,
			disorganized,
			calm,
			conventional
		);

		getTraits(personalityArr);
	}
}

/**
 * Converts the raw data provided by learner into traits numbers
 *
 * @param {Array} arr - array of personality data
 */
function getTraits(arr) {
	// create new container array
	const traitsArr = [];

	// handle scores
	const extraversion = (arr[0] + flipScores(arr[5])) / 2;
	const agreeableness = (flipScores(arr[1]) + arr[6]) / 2;
	const conscientiousness = (arr[2] + flipScores(arr[7])) / 2;
	const emotionalStability = (flipScores(arr[3]) + arr[8]) / 2;
	const opennessToExperience = (arr[4] + flipScores(arr[9])) / 2;

	// push scores into new array
	traitsArr.push(
		extraversion,
		agreeableness,
		conscientiousness,
		emotionalStability,
		opennessToExperience
	);
	pushPersonality(traitsArr);
}

/**
 * Flips scores, used by the TIPI formula
 *
 * @param {Number} score - the score the learner achieved
 * @returns {Number} score - returns flipped number
 */
function flipScores(score) {
	switch (score) {
		case 1:
			return 7;
		case 2:
			return 6;
		case 3:
			return 5;
		case 4:
			return 4;
		case 5:
			return 3;
		case 6:
			return 2;
		case 7:
			return 1;
	}
}

/**
 * Pushes parsonality data to Mongo into the learner's document
 *
 * @param {Array} traitsArr - Array containing traits data
 */
async function pushPersonality(traitsArr) {
	const url = `/personality/${userId}`;
	const personalityData = {
		extraversion: traitsArr[0] >= 4.44 ? 'high' : 'low',
		agreeableness: traitsArr[1] >= 5.23 ? 'high' : 'low',
		conscientiousness: traitsArr[2] >= 5.4 ? 'high' : 'low',
		emotionalStability: traitsArr[3] >= 4.83 ? 'high' : 'low',
		opennessToExperience: traitsArr[4] >= 5.38 ? 'high' : 'low',
	};
	await fetch(url, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(personalityData),
	})
		.then(res => res.json())
		.then(data => {
			console.log('success', data);
		})
		.catch(err => {
			console.log('error', err);
		});
}
