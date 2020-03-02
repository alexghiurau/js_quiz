const profileQuizes = document.getElementById('profileQuizes');

(async () => {
  const userId = await fetch('/api/user_data')
    .then(res => res.json())
    .then(data => data.id)
    .catch(err => console.log(err));

  const url = `/results/${userId}`;

  const results = await fetch(url)
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.log(err));

  output = [];

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
            </br>
            <button class="btn btn-primary" data-quizId=${
              result.quizId
            }>Retry Quiz</button>
          </div>
          `
      );
    });
  } else {
    output.push(`<p>No results to show.</p>`);
  }

  profileQuizes.innerHTML = output.join('');
})();

// function retakeQuiz(quizId) {
//     const url = `/quizes/${quizId}`;

//     await fetch(url)
//         .then(res => res.json())
//         .then(data => data);
// }
