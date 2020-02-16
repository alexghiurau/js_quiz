(async () => {
	const users = await fetch('/users/learners')
		.then(res => res.json())
		.then(data => data);

	const output = [];

	users.forEach(user => {
		output.push(
			`
      <div class="col-sm-3">
      <div class="card">
            <div class="card-body">
              <h5 class="card-title">${user.name}</h5>
              <a class="card-text" href="mailto:${user.email}">
                  ${user.email}
              </p>
              <a href="#" class="btn btn-primary btn-users btn-sm">View Past Results</a>
              <a href="#" class="btn btn-warning btn-users btn-sm" data-userid="${user._id}" onClick=resetPersonality(event)>Reset Personality</a>
            </div>
          </div></div>`
		);
		usersContainer.innerHTML = output.join('');
	});
})();

const usersContainer = document.getElementById('user-list');

async function resetPersonality(event) {
	const userId = event.target.dataset.userid;
	const url = `/personality/${userId}`;
	const personalityData = {
		extraversion: 'n/a',
		agreeableness: 'n/a',
		conscientiousness: 'n/a',
		emotionalStability: 'n/a',
		opennessToExperience: 'n/a',
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

async function updateQuizes() {
	await fetch('/quizes/postquizes', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then(res => res.json)
		.catch(err => console.log(err));
	$('#updateQuizToast').toast('show');
}
