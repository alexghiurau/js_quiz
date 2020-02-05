// Emotional Support Algorithm 1 - Revision 0.0.2
// Returns:
// Score   - score student got in their test (0-100)
// emStab  - emotional stability (low/high)
// consi   - conscientiousness (low/high)

function createFeedbackString(feedbackArr) {
  const arrNoDuplicates = [...new Set(feedbackArr)];
  let feedbackString = '';
  arrNoDuplicates.forEach((sentence) => {
    feedbackString += `${sentence} `;
  });
  return feedbackString;
}

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

function getFeedback(score, emStab, consci) {
  let slant;
  let ES;
  switch (handleScore(score)) {
    case 10:
      slant = 'neutral';
      emStab == 'low' ? (ES = ['ER', 'R', 'A']) : (ES = ['R', 'A']);
      break;
    case 30:
      emStab == 'low' ? (ES = ['ER', 'R', 'A']) : (ES = ['R', 'A']);
      consci == 'low' && emStab != 'low'
        ? (slant = 'negative')
        : (slant = 'neutral');
      break;
    case 45:
      slant = 'neutral';
      ES = ['R', 'A'];
      break;
    case 55:
      slant = 'neutral';
      consci == 'high' ? (ES = ['P', 'A']) : (ES = ['R', 'A']);
      break;
    case 70:
      consci == 'low' ? (ES = ['A']) : (ES = ['P']);
      consci == 'low' && emStab != 'low'
        ? (slant = 'negative')
        : (slant = 'neutral');
      break;
    case 90:
      slant = 'neutral';
      consci == 'low' ? (ES = ['P', 'P']) : (ES = ['P']);
  }

  const feedbackData = {
    score,
    ES,
    slant,
  };
  return createFeedbackArray(feedbackData);
}

function createFeedbackArray(data) {
  const feedbackArr = [];

  data.ES.forEach((statement) => {
    Object.keys(emSupStatements).forEach((key) => {
      if (statement === key) {
        feedbackArr.push(
          emSupStatements[key][
            Math.floor(Math.random() * emSupStatements[key].length)
          ],
        );
      }
    });
  });
  return createFeedbackString(feedbackArr);
}
