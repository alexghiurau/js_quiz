const usersContainer = document.getElementById('user-list');

(async () => {
  const users = await fetch('/users/learners')
    .then(res => res.json())
    .then(data => data);

  const output = [];

  users.forEach(user => {
    output.push(
      `
      <div class="col-sm-4 mb-4">
      <div class="card">
            <div class="card-body">
              <h5 class="card-title">${user.name}</h5>
              <a class="card-text" href="mailto:${user.email}">
                  ${user.email}
              </p>
              <a href="#" class="btn btn-primary btn-users btn-sm" data-userid="${user._id}" onClick=getLearnerResults(event)>View Past Results</a>
              <a href="#" class="btn btn-warning btn-users btn-sm" data-userid="${user._id}" onClick=resetPersonality(event)>Reset Personality</a>
            </div>
          </div></div>`
    );
    usersContainer.innerHTML = output.join('');
  });
})();

/**
 * Function that gets a learner's results and displays
 * a modal showing those.
 *
 * @param {*} event - used to get user id
 */
async function getLearnerResults(event) {
  const userId = event.target.dataset.userid;

  resultsModal = document.getElementById('resultsModalBody');

  const output = [];

  const url = `/results/${userId}`;

  const results = await fetch(url)
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.log(err));

  if (results.length > 0) {
    results.forEach(result => {
      output.push(
        `<div class="card p-4 mb-4">
        <h5>Quiz Date/Time</h5>
        <p>${result.date}</p>
        <h5>Score</h5>
        <p>${result.score + '%'}</p>
        <h5>Feedback</h5>
        <p>${result.feedback}</p>
        <h5>Minutes Taken</h5>
        <p>${result.time + (result.time > 1 ? ' minutes' : ' minute')}</p>
      </div>
      `
      );
    });
  } else {
    output.push(`<p>Learner has no results on record.</p>`);
  }

  resultsModal.innerHTML = output.join('');

  $('#resultsModal').modal();
}

/**
 * Resets personality for a given learner. This will promt them
 * to complete the personality questionnaire upon loggin in.
 *
 * @param {*} event - used to get the user id
 */
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
      window.alert('Personality successfully reset.');
    })
    .catch(err => {
      console.log('error', err);
    });
}

/**
 * Updates the quizes collection in Mongo using the quizes.json file
 *
 */
async function updateQuizes() {
  try {
    await fetch('/quizes/postquizes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    $('#btn-quizes').html('Updated');
    setTimeout(() => {
      $('#btn-quizes').html('Update Quizes');
    }, 5000);
  } catch (error) {
    console.log(error);
    window.alert('Error! Double-check quizes.json file.');
  }
}
