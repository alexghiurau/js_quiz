// store userId of current user
let userId;

(async function () {

  // get userId of current user
  userId = await fetch('api/user_data')
    .then(res => res.json())
    .then(data => data.id);

  const url = `/personality/${userId}`;
  const user = await fetch(url)
    .then(res => res.json())

  if (user.personality.extraversion === 0 || 
    user.personality.agreeableness === 0 ||
    user.personality.conscientiousness === 0 ||
    user.personality.emotionalStability === 0 ||
    user.personality.opennessToExperience === 0) {
      $("#personalityModal").modal();
    }

}());

const personalityArr = [];

function handlePersonality() {
  // get values from personality modal form
  const extraverted = parseInt($('#extravertedSelect :selected').val(), 10);
  const critical = parseInt($('#criticalSelect :selected').val(), 10);
  const dependable = parseInt($('#dependableSelect :selected').val(), 10);
  const anxious = parseInt($('#anxiousSelect :selected').val(), 10);
  const open = parseInt($('#openToExperiencesSelect :selected').val(), 10);
  const reserved = parseInt($('#reservedSelect :selected').val(), 10);
  const sympathetic = parseInt($('#sympatheticSelect :selected').val(), 10);
  const disorganized = parseInt($('#disorganizedSelect :selected').val(), 10);
  const calm = parseInt($('#calmSelect :selected').val(), 10);
  const conventional = parseInt($('#conventionalSelect :selected').val(), 10);

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
  pushPersonality(traitsArr);
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

async function pushPersonality (traitsArr) {
  const url = `/personality/${userId}`;
  const personalityData = {
    extraversion: traitsArr[0],
    agreeableness: traitsArr[1],
    conscientiousness: traitsArr[2],
    emotionalStability: traitsArr[3],
    opennessToExperience: traitsArr[4]
  }
  await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
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