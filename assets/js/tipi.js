(async function () {
  let email = "a@b.c";
  const url = `/personality/${email}`;
  const personality = await fetch(url)
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.log(err));

  console.log(personality);

  if (personality.personality.extraversion === 0 || 
    personality.personality.agreeableness === 0 ||
    personality.personality.conscientiousness === 0 ||
    personality.personality.emotionalStability === 0 ||
    personality.personality.opennessToExperience === 0) {
      console.log("if statement definitely works!😂");
    }

}());

const personalityArr = [];

function handlePersonality() {
  // get values from personality modal form
  const extraverted = parseInt($('#extravertedSelect :selected').val());
  const critical = parseInt($('#criticalSelect :selected').val());
  const dependable = parseInt($('#dependableSelect :selected').val());
  const anxious = parseInt($('#anxiousSelect :selected').val());
  const open = parseInt($('#openToExperiencesSelect :selected').val());
  const reserved = parseInt($('#reservedSelect :selected').val());
  const sympathetic = parseInt($('#sympatheticSelect :selected').val());
  const disorganized = parseInt($('#disorganizedSelect :selected').val());
  const calm = parseInt($('#calmSelect :selected').val());
  const conventional = parseInt($('#conventionalSelect :selected').val());

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
    conventional,
  );

  console.log('personality array: ');
  console.log(personalityArr);

  getTraits(personalityArr);
}

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
    opennessToExperience,
  );

  console.log('traits arr is: ');
  console.log(traitsArr);
}

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

// let arr = [6, 5, 6, 4, 7, 5, 4, 2, 5, 4];
