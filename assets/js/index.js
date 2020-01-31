(function() {
  const emStab = sessionStorage.getItem("emStab");
  const consci = sessionStorage.getItem("consci");

  if (emStab === null || consci === null) {
    $("#personalityModal").modal();
  }

  const questions = [
    {
      question: "Place balls in cups so that all amounts are equal.",
      balls: [5, 2, 3],
      cups: 2
    },
    {
      question: "Place balls in cups so that all amounts are equal.",
      balls: [10, 10, 5, 5],
      cups: 3
    },
    {
      question: "Place balls in cups so that all amounts are equal.",
      balls: [4, 2, 2],
      cups: 2
    }
  ];

  function buildQuiz() {
    const output = [];

    // for each question...
    questions.forEach((currentQuestion, questionNumber) => {
      // handle cups ids
      let cupIdArr = [];
      for (let i = 1; i <= currentQuestion.cups; i++) {
        cupIdArr.push(i);
      }

      // handle balls / balls ids
      const getUniqueId = (i => () => i++)(0);
      const arrOfBalls = currentQuestion.balls.map(value => ({
        id: Math.floor(Math.random() * 100000),
        value
      }));

      // create a slide
      output.push(
        `<div class="slide">
           <div class="question">${questionNumber + 1} of ${
          questions.length
        }. ${currentQuestion.question} </div>
           <div class="horizontal">
           <div id="basket">
            ${arrOfBalls
              .map(
                (ball, i) => `
            <div id="${`ball${ball.id}`}" class="ball" data-value="${
                  ball.value
                }" draggable="true" ondragstart="dragBall(event)">${
                  ball.value
                }</div>`
              )
              .join("")}
           </div>
           ${cupIdArr
             .map(
               (cup, i) => `
            <div id="${`cup${cup}`}" class="cup" data-value="${i}" ondrop="dropBallOnCup(event)" onDragOver="allowDrop(event)"></div>`
             )
             .join("")}
             </div>
         </div>`
      );
    });
    // add everything to page
    quizContainer.innerHTML = output.join("");
  }

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

  function checkCurrentSlide() {
    let check = false;
    const slide = quizContainer.querySelector("div.active-slide");
    const cups = slide.querySelectorAll("div.horizontal > div.cup");

    let answers = createAnwersStore(cups);

    answers.forEach(answer => {
      answer.length == 0 ? (check = false) : (check = true);
    });
    return check;
  }

  // shows results when Submit is clicked
  function showResults() {
    const check = checkCurrentSlide();
    if (check) {
      let numCorrect = 0;

      const slides = quizContainer.querySelectorAll("div.slide");
      slides.forEach(slide => {
        const cups = slide.querySelectorAll("div.horizontal > div.cup");

        let answers = createAnwersStore(cups);

        const calculatedAnswers = answers
          .map(x => x.reduce((p, n) => p + n, 0))
          .every((x, n, a) => a[n] === a[0]);
        if (calculatedAnswers) {
          numCorrect += 1;
        }
      });

      // show number of correct answers out of total and get feedback
      const percent = (numCorrect / questions.length) * 100;
      const rounded_number = Math.round(percent * 100) / 100;
      resultsContainer.innerHTML = `You scored ${numCorrect} out of ${questions.length} (${rounded_number}%)`;

      // get feedback from alg1.js and put on page

      feedbackContainer.innerHTML = getFeedback(
        rounded_number,
        sessionStorage.getItem("emStab"),
        sessionStorage.getItem("consci")
      );
      $("#submit").prop("disabled", true);
      $("#previous").prop("disabled", true);
      $("#submit").addClass("button-finished");
    } else {
      $("#errorModal").modal();
    }
  }

  // shows a slide with a question from the set  s
  function showSlide(n) {
    slides[currentSlide].classList.remove("active-slide");
    slides[n].classList.add("active-slide");
    currentSlide = n;

    if (currentSlide === 0) {
      previousButton.style.display = "none";
    } else {
      previousButton.style.display = "inline-block";
    }

    if (currentSlide === slides.length - 1) {
      nextButton.style.display = "none";
      submitButton.style.display = "inline-block";
    } else {
      nextButton.style.display = "inline-block";
      submitButton.style.display = "none";
    }
  }

  function showNextSlide() {
    const check = checkCurrentSlide();
    if (check) {
      showSlide(currentSlide + 1);
    } else {
      $("#errorModal").modal();
    }
  }

  function showPreviousSlide() {
    showSlide(currentSlide - 1);
  }

  const quizContainer = document.getElementById("quiz");
  const resultsContainer = document.getElementById("results");
  const feedbackContainer = document.getElementById("feedback");
  const submitButton = document.getElementById("submit");

  // display quiz as page loads
  buildQuiz();

  const previousButton = document.getElementById("previous");
  const nextButton = document.getElementById("next");
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  showSlide(0);

  // on submit, show the results
  submitButton.addEventListener("click", showResults);
  previousButton.addEventListener("click", showPreviousSlide);
  nextButton.addEventListener("click", showNextSlide);
})();

function handlePersonality() {
  const emStab = $("#emStabCombo :selected").val();
  const consci = $("#consciCombo :selected").val();

  sessionStorage.setItem("emStab", emStab);
  sessionStorage.setItem("consci", consci);
}

// allow dropping onto elements
function allowDrop(ev) {
  ev.preventDefault();
  if (ev.target.getAttribute("draggable") == "true")
    ev.dataTransfer.dropEffect = "none";
  else ev.dataTransfer.dropEffect = "all";
}

// allow dragging a ball, getting its id
function dragBall(ev) {
  ev.dataTransfer.setData("ballId", ev.target.id);
}

// allow dropping a ball onto a cup element
function dropBallOnCup(ev) {
  ev.preventDefault();
  const ballId = ev.dataTransfer.getData("ballId");
  const cup = ev.target;
  const ballElement = document.getElementById(ballId);
  cup.appendChild(ballElement);
}
