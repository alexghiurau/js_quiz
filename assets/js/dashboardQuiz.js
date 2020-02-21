(async () => {
  // get a random quiz
  const url = `/quizes`;
  const quiz = await fetch(url)
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.log(err));

  /**
   * Builds quiz elements using the Quiz object from above.
   *
   */
  function buildQuiz() {
    const output = [];

    // for each question...
    quiz.questions.forEach((currentQuestion, questionNumber) => {
      // handle cups ids
      const cupIdArr = [];
      for (let i = 1; i <= currentQuestion.cups; i++) {
        cupIdArr.push(i);
      }

      // handle balls / balls ids
      const arrOfBalls = currentQuestion.balls.map(value => ({
        id: Math.floor(Math.random() * 1000000),
        value,
      }));

      // create a slide
      output.push(
        `<div class="slide">
           <div class="question">${questionNumber + 1} of ${
          quiz.questions.length
        }. ${currentQuestion.question} </div>
           <div class="horizontal">
           <div id="basket">
            ${arrOfBalls
              .map(
                ball => `
            <div id="${`ball${ball.id}`}" class="ball" data-value="${
                  ball.value
                }" draggable="true" ondragstart="dragBall(event)">${
                  ball.value
                }</div>`
              )
              .join('')}
           </div>
           ${cupIdArr
             .map(
               (cup, i) => `
            <div id="${`cup${cup}`}" class="cup" data-value="${i}" ondrop="dropBallOnCup(event)" onDragOver="allowDrop(event)"></div>`
             )
             .join('')}
             </div>
         </div>`
      );
    });
    // add everything to page
    quizContainer.innerHTML = output.join('');
    // start the timer
    startStopCounter();
  }

  /**
   * Creates temporary table to store answers. Used for checking if
   * correct.
   *
   * @param {Array} cups - an array of cups
   * @returns {Array} answers - an array of answers
   */
  function createAnwersStore(cups) {
    const answers = [];
    for (let i = 0; i < cups.length; i++) {
      answers[i] = [];
    }

    cups.forEach(cup =>
      cup.childNodes.forEach(ball => {
        for (let i = 0; i < cups.length; i++) {
          if (i == cup.dataset.value) {
            answers[i].push(parseInt(ball.dataset.value, 10));
          }
        }
      })
    );
    return answers;
  }

  /**
   * Check if current slide's cups have at least one ball inside.
   * Needed for calculations.
   *
   * @returns {Boolean} check - returns true if all cups have at least
   * one ball inside.
   */
  function checkCurrentSlide() {
    let check = true;
    let incompleteCounter = 0;
    const slide = quizContainer.querySelector('div.active-slide');
    const cups = slide.querySelectorAll('div.horizontal > div.cup');

    const answers = createAnwersStore(cups);

    answers.forEach(answer => {
      if (answer.length == 0) {
        incompleteCounter += 1;
      }
    });

    if (incompleteCounter > 0) {
      check = false;
    } else {
      check = true;
    }
    return check;
  }

  /**
   * Shows results when 'Submit'
   *
   */
  async function showResults() {
    const check = checkCurrentSlide();
    if (!check) {
      $('#errorModal').modal();
    } else {
      let numCorrect = 0;

      const slides = quizContainer.querySelectorAll('div.slide');
      slides.forEach(slide => {
        const cups = slide.querySelectorAll('div.horizontal > div.cup');

        const answers = createAnwersStore(cups);

        const calculatedAnswers = answers
          .map(x => x.reduce((p, n) => p + n, 0))
          .every((x, n, a) => a[n] === a[0]);
        if (calculatedAnswers) {
          numCorrect += 1;
        }
      });

      // stop the timer
      startStopCounter();

      // show number of correct answers out of total and get feedback
      const percent = (numCorrect / quiz.questions.length) * 100;
      const rounded_number = Math.round(percent * 100) / 100;
      resultsContainer.innerHTML = `You scored ${numCorrect} out of ${quiz.questions.length} (${rounded_number}%)`;

      // get the user personality data from mongo
      const personalityData = await getPersonalityData();

      // get feedback from alg1.js and put on page
      feedbackContainer.innerHTML = getFeedback(
        rounded_number,
        personalityData
      );
      // push results to mongo
      pushResults(quiz._id, rounded_number, getQuizTime());

      // disable buttons to prevent user navigation
      $('#submit').prop('disabled', true);
      $('#previous').prop('disabled', true);
    }
  }

  /**
   * Gets personality data for current user from Mongo
   *
   * @returns {Object} personality - personality data needed by algorithm.
   */
  async function getPersonalityData() {
    // get userId or current user
    const userId = await fetch('/api/user_data')
      .then(res => res.json())
      .then(data => data.id);

    // get personality data
    const personalityData = await fetch(`/personality/${userId}`)
      .then(res => res.json())
      .then(data => data.personality);

    return personalityData;
  }

  /**
   * Shows a slide with a question from the set
   *
   * @param {Number} n - Index for slide to be shown
   */
  function showSlide(n) {
    slides[currentSlide].classList.remove('active-slide');
    slides[n].classList.add('active-slide');
    currentSlide = n;

    if (currentSlide === 0) {
      previousButton.style.display = 'none';
    } else {
      previousButton.style.display = 'inline-block';
    }

    if (currentSlide === slides.length - 1) {
      nextButton.style.display = 'none';
      submitButton.style.display = 'inline-block';
    } else {
      nextButton.style.display = 'inline-block';
      submitButton.style.display = 'none';
    }
  }

  /**
   * Shows the next slide (and next question) in the set.
   *
   */
  function showNextSlide() {
    const check = checkCurrentSlide();
    if (!check) {
      $('#errorModal').modal();
    } else {
      showSlide(currentSlide + 1);
    }
  }

  /**
   * Shows the previous slide (and previous question) in the set.
   *
   */
  function showPreviousSlide() {
    showSlide(currentSlide - 1);
  }

  const quizContainer = document.getElementById('quiz');
  const resultsContainer = document.getElementById('results');
  const feedbackContainer = document.getElementById('feedback');
  const submitButton = document.getElementById('submit');

  // display quiz as page loads
  buildQuiz();

  const previousButton = document.getElementById('previous');
  const nextButton = document.getElementById('next');
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;

  showSlide(0);

  // on submit, show the results
  submitButton.addEventListener('click', showResults);
  previousButton.addEventListener('click', showPreviousSlide);
  nextButton.addEventListener('click', showNextSlide);
})();

// MENTION IN IMPLEMENTATION ALSO

// function handlePersonality() {
//   const emStab = $('#emStabCombo :selected').val();
//   const consci = $('#consciCombo :selected').val();

//   sessionStorage.setItem('emStab', emStab);
//   sessionStorage.setItem('consci', consci);
// }

/**
 * Allow dropping onto elements
 *
 * @param {*} ev - event
 */
function allowDrop(ev) {
  ev.preventDefault();
  if (ev.target.getAttribute('draggable') == 'true') {
    ev.dataTransfer.dropEffect = 'none';
  } else ev.dataTransfer.dropEffect = 'all';
}

/**
 * Allow dragging a ball, and get its id
 *
 * @param {*} ev - event
 */
function dragBall(ev) {
  ev.dataTransfer.setData('ballId', ev.target.id);
}

/**
 * Allow dropping a ball onto cup element.
 *
 * @param {*} ev - event
 */
function dropBallOnCup(ev) {
  ev.preventDefault();
  const ballId = ev.dataTransfer.getData('ballId');
  const cup = ev.target;
  const ballElement = document.getElementById(ballId);
  cup.appendChild(ballElement);
}

/**
 * Pushes results to Mongo in the collection 'results'
 *
 * @param {String} quizId - The _id of the quiz
 * @param {Number} score - Score the learner achieved
 * @param {Number} time - Minutes the student took
 */
async function pushResults(quizId, score, time) {
  const userId = await fetch('/api/user_data')
    .then(res => res.json())
    .then(data => data.id);
  const url = `/results/postresult`;
  const results = {
    userId,
    quizId,
    score,
    time,
  };
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(results),
  })
    .then(res => res.json())
    .then(data => {
      console.log('success', data);
    })
    .catch(err => {
      console.log('error', err);
    });
}

// INCLUDE IN IMPLEMENTATION PROBLEMS

// async function getData(url) {
//   const response = await fetch(url);
//   return response.json();
// }

// async function main() {
//   const url = '/questions';
//   const data = await getData(url)
//   data.then(retVal => {
//     return retVal;
//   });

// }
