async function sendQuizes(quizes) {
  await fetch("/sendQuizes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quizes)
  })
    .then(res => res.json())
    .then(data => console.log(data)
    .catch(err => console.log(err)));
}
