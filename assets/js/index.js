(function () {
  const emStab = sessionStorage.getItem('emStab');
  const consci = sessionStorage.getItem('consci');

  if (emStab === null || consci === null) {
    $('#personalityModal').modal();
  }
  console.log(sessionStorage.getItem('emStab'));
  console.log(sessionStorage.getItem('consci'));
  const myQuestions = [
    {
      questionType: 'cupBalls',
      question: 'Place balls in cups so that all amounts are equal.',
      balls: [
        {
          id: 1,
          value: 2,
        },
        {
          id: 2,
          value: 5,
        },
        {
          id: 3,
          value: 3,
        },
      ],
      cups: [1, 2],
    },
    {
      questionType: 'cupBalls',
      question: 'Place balls in cups so that all amounts are equal.',
      balls: [
        {
          id: 4,
          value: 10,
        },
        {
          id: 5,
          value: 10,
        },
        {
          id: 6,
          value: 5,
        },
        {
          id: 7,
          value: 5,
        },
      ],
      cups: [1, 2, 3],
    },
    {
      questionType: 'cupBalls',
      question: 'Place balls in cups so that all amounts are equal.',
      balls: [
        {
          id: 8,
          value: 4,
        },
        {
          id: 9,
          value: 2,
        },
        {
          id: 10,
          value: 2,
        },
      ],
      cups: [1, 2],
    },
  ];

  function buildQuiz() {
    const output = [];
    // for each question...
    myQuestions.forEach((currentQuestion, questionNumber) => {
      // create a slide
      output.push(
        `<div class="slide">
           <div class="question">${questionNumber + 1} of ${
    myQuestions.length
  }. ${currentQuestion.question} </div>
           <div class="horizontal">
           <div id="basket">
            ${currentQuestion.balls
    .map(
      (ball, i) => `
            <div id="${`ball${ball.id}`}" class="ball" data-value="${
    ball.value
  }" draggable="true" ondragstart="dragBall(event)">${
    ball.value
  }</div>`,
    )
    .join('')}
           </div>
           ${currentQuestion.cups
    .map(
      (cup, i) => `
            <div id="${`cup${
    cup}`}" class="cup" data-value="${i}" ondrop="dropBallOnCup(event)" onDragOver="allowDrop(event)"></div>`,
    )
    .join('')}
             </div>
         </div>`,
      );
    });
    // add everything to page
    quizContainer.innerHTML = output.join('');
  }

  function checkCurrentSlide() {
    let check = false;
    const slide = quizContainer.querySelector('div.active-slide');
    const cups = slide.querySelectorAll('div.horizontal > div.cup');

    const answers = [];
    for (let i = 0; i < cups.length; i++) {
      answers[i] = [];
    }

    cups.forEach((cup) => cup.childNodes.forEach((ball) => {
      for (let i = 0; i < cups.length; i++) {
        if (i == cup.dataset.value) {
          answers[i].push(parseInt(ball.dataset.value, 10));
        }
      }
    }));
    answers.forEach((answer) => {
      answer.length == 0 ? (check = false) : (check = true);
    });
    return check;
  }

  // shows results when Submit is clicked
  function showResults() {
    const check = checkCurrentSlide();
    if (check) {
      let numCorrect = 0;

      const slides = quizContainer.querySelectorAll('div.slide');
      slides.forEach((slide) => {
        const cups = slide.querySelectorAll('div.horizontal > div.cup');

        const answers = [];
        for (let i = 0; i < cups.length; i++) {
          answers[i] = [];
        }

        cups.forEach((cup) => cup.childNodes.forEach((ball) => {
          for (let i = 0; i < cups.length; i++) {
            if (i == cup.dataset.value) {
              answers[i].push(parseInt(ball.dataset.value, 10));
            }
          }
        }));
        console.log(answers);

        const calculatedAnswers = answers
          .map((x) => x.reduce((p, n) => p + n, 0))
          .every((x, n, a) => a[n] === a[0]);
        if (calculatedAnswers) {
          numCorrect += 1;
        }
      });

      console.log(numCorrect);
      // show number of correct answers out of total and get feedback
      const percent = (numCorrect / myQuestions.length) * 100;
      const rounded_number = Math.round(percent * 100) / 100;
      resultsContainer.innerHTML = `You scored ${numCorrect} out of ${myQuestions.length} (${rounded_number}%)`;

      // get feedback from alg1.js and put on page
      const feedback = getFeedback(
        rounded_number,
        sessionStorage.getItem('emStab'),
        sessionStorage.getItem('consci'),
      );
      const results = {
        score: rounded_number,
        feedback,
      };

      console.log(results);

      feedbackContainer.innerHTML = feedback;
      $('#submit').prop('disabled', true);
      $('#previous').prop('disabled', true);
      $('#submit').addClass('button-finished');
    } else {
      $('#errorModal').modal();
    }
  }

  // shows a slide with a question from the set  s
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

  function showNextSlide() {
    const check = checkCurrentSlide();
    if (check) {
      showSlide(currentSlide + 1);
    } else {
      $('#errorModal').modal();
    }
  }

  function showPreviousSlide() {
    showSlide(currentSlide - 1);
  }

  const quizContainer = document.getElementById('quiz');
  const resultsContainer = document.getElementById('results');
  const feedbackContainer = document.getElementById('feedback');
  const submitButton = document.getElementById('submit');

  // display quiz right away
  buildQuiz();

  const previousButton = document.getElementById('previous');
  const nextButton = document.getElementById('next');
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;

  showSlide(0);

  // on submit, show results
  submitButton.addEventListener('click', showResults);
  previousButton.addEventListener('click', showPreviousSlide);
  nextButton.addEventListener('click', showNextSlide);
}());

function handlePersonality() {
  const emStab = $('#emStabCombo :selected').val();
  const consci = $('#consciCombo :selected').val();

  sessionStorage.setItem('emStab', emStab);
  sessionStorage.setItem('consci', consci);
}

// allow dropping onto elements
function allowDrop(ev) {
  ev.preventDefault();
  if (ev.target.getAttribute('draggable') == 'true') ev.dataTransfer.dropEffect = 'none';
  else ev.dataTransfer.dropEffect = 'all';
}

// allow dragging a ball, getting its id
function dragBall(ev) {
  ev.dataTransfer.setData('ballId', ev.target.id);
}

// allow dropping a ball onto a cup element
function dropBallOnCup(ev) {
  ev.preventDefault();
  const ballId = ev.dataTransfer.getData('ballId');
  const cup = ev.target;
  const ballElement = document.getElementById(ballId);
  cup.appendChild(ballElement);
}
