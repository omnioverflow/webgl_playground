let model;

// The text field containing the input text
let inputText;

// The text field containing the question
let questionText;

// The div where we will write the model's answer
let answersOutput;

// Sample passage from Wikipedia.
const doText = `DigitalOcean, Inc. is an American cloud infrastructure provider[2] headquartered in New York City with data centers worldwide.[3]
DigitalOcean provides developers cloud services that help to deploy and scale applications that run simultaneously on multiple computers.
DigitalOcean also runs Hacktoberfest which is a month-long celebration (October 1-31) of open source software run in partnership with GitHub and Twilio.
`;

function createButton(innerText, id, listener, selector, disabled = false) {
    const btn = document.createElement('BUTTON');
    btn.innerText = innerText;
    btn.id = id;
    btn.disabled = disabled;
  
    btn.addEventListener('click', listener);
    document.querySelector(selector).appendChild(btn);
  }

  function setupButtons() {
    // Button to predict
    createButton('Answer!', 'answer-btn',
      () => {
        model.findAnswers(questionText.value, inputText.value).then((answers) => {
          // Write the answers to the output div as an unordered list.
          // It uses map create a new list of the answers while adding the list tags.
          // Then, we use join to concatenate the answers as an array with a line break
          // between answers.
          const answersList = answers.map((answer) => `<li>${answer.text} (confidence: ${answer.score})</li>`)
            .join('<br>');
  
          answersOutput.innerHTML = `<ul>${answersList}</ul>`;
        }).catch((e) => console.log(e));
      }, '#answer-button', false);

      createButton('DigitalOcean', 'test-case-do-btn',
        () => {
        document.getElementById('input-text').value = doText;
        }, '#test-buttons', false);
  }

  async function init() {
    setupButtons();
    answersOutput = document.getElementById('answer');
    inputText = document.getElementById('input-text');
    questionText = document.getElementById('question');
  
    model = await qna.load();
    document.getElementById('answer-btn').disabled = false;
  }

  init();