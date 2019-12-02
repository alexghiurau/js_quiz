(function() {
  const myQuestions = [
    {
      questionType: "cupBalls",
      question: "Place balls in cups so that all amounts are equal.",
      balls: [
        {
          id: 1,
          value: 2
        },
        {
          id: 2,
          value: 5
        },
        {
          id: 3,
          value: 3
        }
      ],
      cups: [1, 2]
    },
    {
      questionType: "cupBalls",
      question: "Place balls in cups so that all amounts are equal.",
      balls: [
        {
          id: 4,
          value: 10
        },
        {
          id: 5,
          value: 10
        },
        {
          id: 6,
          value: 5
        },
        {
          id: 7,
          value: 5
        }
      ],
      cups: [4, 5, 6]
    }
  ];

  function buildQuiz() {
    const output = [];
    // for each question...
    myQuestions.forEach((currentQuestion, questionNumber) => {
      // add balls
      output.push(
        `<div class="slide">
           <div class="question">${questionNumber + 1}. ${
          currentQuestion.question
        } </div>
           <div class="horizontal">
           <div id="basket">
            ${currentQuestion.balls
              .map(
                (ball, i) => `
            <div id="${"ball" + ball.id}" class="ball" data-value="${
                  ball.value
                }" draggable="true" ondragstart="dragBall(event)">${
                  ball.value
                }</div>`
              )
              .join("")}
           </div>
           ${currentQuestion.cups
             .map(
               (cup, i) => `
            <div id="${"cup" +
              cup}" class="cup" data-value="${cup}" ondrop="dropBallOnCup(event)" onDragOver="allowDrop(event)"></div>`
             )
             .join("")}
             </div>
         </div>`
      );
    });
    // add everything to page
    quizContainer.innerHTML = output.join("");
  }

  function showResults() {

    let slides = quizContainer.querySelectorAll("div.slide");
    slides.forEach(slide => {
      let cups = slide.querySelectorAll("div.horizontal > div.cup");
      let answers = [];
      for (let i = 0; i < cups.length; i++) {
        answers[i] = [];
      }

      cups.forEach(cup =>{
        let balls = cup.querySelectorAll("div.ball");
      });
      // console.log(answers);
    });

    // keep track of user's answers
    let numCorrect = 0;

    // // for each question...
    // myQuestions.forEach((currentQuestion, questionNumber) => {
    //   // find selected answer
    //   const answerContainer = answerContainers[questionNumber];
    //   const selector = `input[name=question${questionNumber}]:checked`;
    //   const userAnswer = (answerContainer.querySelector(selector) || {}).value;

    //   // if answer is correct
    //   if (userAnswer === currentQuestion.correctAnswer) {
    //     // add to the number of correct answers
    //     numCorrect++;

    //     // color the answers green
    //     answerContainers[questionNumber].style.color = "lightgreen";
    //   } else {
    //     // if answer is wrong or blank
    //     // color the answers red
    //     answerContainers[questionNumber].style.color = "red";
    //   }
    // });

    // show number of correct answers out of total
    resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
  }

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
    showSlide(currentSlide + 1);
  }

  function showPreviousSlide() {
    showSlide(currentSlide - 1);
  }

  const quizContainer = document.getElementById("quiz");
  const resultsContainer = document.getElementById("results");
  const submitButton = document.getElementById("submit");

  // display quiz right away
  buildQuiz();

  const previousButton = document.getElementById("previous");
  const nextButton = document.getElementById("next");
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  showSlide(0);

  // on submit, show results
  submitButton.addEventListener("click", showResults);
  previousButton.addEventListener("click", showPreviousSlide);
  nextButton.addEventListener("click", showNextSlide);
})();

function allowDrop(ev) {
  ev.preventDefault();
  if (ev.target.getAttribute("draggable") == "true")
    ev.dataTransfer.dropEffect = "none";
  else ev.dataTransfer.dropEffect = "all";
}

function dragBall(ev) {
  ev.dataTransfer.setData("ballId", ev.target.id);
}

function dropBallOnCup(ev) {
  ev.preventDefault();
  const ballId = ev.dataTransfer.getData("ballId");
  let cup = ev.target;
  let ballElement = document.getElementById(ballId);
  cup.appendChild(ballElement);
}

// ${currentQuestion.balls.forEach(ball => {
//   `<div id="${"cup" + ball.id}" class="ball" draggable="true" data-value="${ball.value} ondragstart="dragBall(event)">${ball.value}</div>`
// })}

// ${currentQuestion.balls.forEach(ball => {
//   `<div>${ball.id, ball.value}</div>` // this doesn't werk
//   //  console.log(`ball id: ${ball.id}, ball value: ${ball.value}`) // this just werks
// })}
