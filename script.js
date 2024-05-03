const csvData = []; // Store CSV data here
let currentMode;
let currentQuestionIndex = 0;
let correctAnswers = 0;

// Function to load CSV data
function loadCSV() {
  fetch("./data.csv") // Replace "data.csv" with your actual file path
    .then(response => response.text())
    .then(data => {
      const lines = data.split("\n");
      lines.forEach(line => {
        const [abbreviation, english, japanese] = line.split(",");
        csvData.push({ abbreviation, english, japanese });
      });
      // Shuffle the data for random order
      csvData.sort(() => Math.random() - 0.5);
      startQuiz();
    });
}

// Function to start the quiz based on chosen mode
function startQuiz() {
  currentMode = document.querySelector(".modes button.active")?.id;
  document.querySelector(".modes").classList.add("hidden");
  document.getElementById("quiz-area").classList.remove("hidden");
  showQuestion();
}

// Function to display the next question
function showQuestion() {
  const question = csvData[currentQuestionIndex];
  switch (currentMode) {
    case "jpn-to-eng":
      document.getElementById("question").textContent = question.japanese;
      break;
    case "eng-to-jpn":
      document.getElementById("question").textContent = question.english;
      break;
    case "abbr-to-jpn":
      document.getElementById("question").textContent = question.abbreviation;
      break;
    // ... add similar cases for other modes
  }
  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";
}

// Function to check the answer
function checkAnswer() {
  const answer = document.getElementById("answer").value.trim().toLowerCase();
  const question = csvData[currentQuestionIndex];
  let isCorrect = false;
  switch (currentMode) {
    case "jpn-to-eng":
      isCorrect = answer === question.english.toLowerCase();
      break;
    case "eng-to-jpn":
      isCorrect = answer === question.japanese.toLowerCase();
      break;
    // ... add similar cases for other modes
  }
  if (isCorrect) {
    correctAnswers++;
    document.getElementById("feedback").textContent = "Correct!";
  } else {
    document.getElementById("feedback").textContent =
      `Incorrect. The correct answer is: ${question.english}`;
  }
}

// Function to move to the next question
function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex >= csvData.length) {
    showResults();
  } else {
    showQuestion();
  }
  updateScore();
}

// Function to display the final results
function showResults() {
  document.getElementById("quiz-area").classList.add("hidden");
  document.getElementById("results").classList.remove("hidden");
  document.getElementById("correct-count").textContent = correctAnswers;
  document.getElementById("percentage").textContent =
    ((correctAnswers / csvData.length) * 100).toFixed(2) + "%";
  // Disable further interaction after results are shown
  document.querySelectorAll(".modes button, #check-answer, #next-question").forEach(
    (button) => (button.disabled = true)
  );
}

// Add event listeners
document.querySelectorAll(".modes button").forEach(button => {
  button.addEventListener("click", () => {
    button.classList.add("active");
    startQuiz();
  });
});

document.getElementById("check-answer").addEventListener("click", checkAnswer);
document.getElementById("next-question").addEventListener("click", nextQuestion);
document.getElementById("exit-quiz").addEventListener("click", exitQuiz);

// Function to exit the quiz
function exitQuiz() {
  showResults(); // Display final results immediately
}

// Update score display on answer check
function updateScore() {
  document.getElementById("correct-count").textContent = correctAnswers;
  document.getElementById("total-questions").textContent = csvData.length;
}

// Check for completion after each question
function nextQuestion() {
  // ... (same logic as before)
  if (currentQuestionIndex >= csvData.length) {
    showResults();
  } else {
    showQuestion();
  }
  updateScore();
}

// Load CSV data on page load
loadCSV();
