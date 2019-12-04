// Emotional Support Algorithm 1 - Revision 0.0.2
// Returns:
// Score   - score student got in their test (0-100)
// emStab  - emotional stability (low/high)
// consi   - conscientiousness (low/high)

// Emotional Support Statements

const emSupStatements = {
  P: ["That was hard but you did it.", "I am proud of you.", "Well done."],
  ER: [
    "I know what you're feeling.",
    "You must be really happy.",
    "I understand that you may be upset."
  ],
  R: [
    "Everyone is wrong sometimes.",
    "Everyone finds this hard.",
    "You will get the hang of it eventually."
  ],
  A: [
    "Just keep practising.",
    "Just take a bit longer next time.",
    "Just read the questions more carefully."
  ]
};

function getFeedback(score, emStab, consci) {
  let slant;
  let ES;

  switch (score) {
    case 10:
      slant = "neutral";
      emStab == "low" ? (ES = ["ER", "R", "A"]) : (ES = ["R", "A"]);
      break;
    case 30:
      emStab == "low" ? (ES = ["ER", "R", "A"]) : (ES = ["R", "A"]);
      consci == "low" && emStab != "low"
        ? (slant = "negative")
        : (slant = "neutral");
      break;
    case 45:
      slant = "neutral";
      ES = ["R", "A"];
      break;
    case 55:
      slant = "neutral";
      consci == "high" ? (ES = ["P", "A"]) : (ES = ["R", "A"]);
      break;
    case 70:
      consci == "low" ? (ES = ["A"]) : (ES = ["P"]);
      consci == "low" && emStab != "low"
        ? (slant = "negative")
        : (slant = "neutral");
      break;
    case 90:
      slant = "neutral";
      consci == "low" ? (ES = ["P", "P"]) : (ES = ["P"]);
  }

  const feedbackData = {
    score,
    ES,
    slant
  };

  let feedbackArr = [];

  ES.forEach(statement => {
    Object.keys(emSupStatements).forEach(key => {
      if (statement == key) {
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

function createFeedbackString(feedbackArr) {
  let arrNoDuplicates = [...new Set(feedbackArr)];
  let feedbackString = "";
  arrNoDuplicates.forEach(sentence => {
    feedbackString += sentence + " ";
  });
  return feedbackString;
}