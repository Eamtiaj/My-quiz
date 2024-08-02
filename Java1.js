const quizData = [
    { question: "Choose the correct option?", options: ["Baigan", "Aayein","Porphyra", "Polysiphonia"], correct: 2, image: "image.jpg" },
    { question: "Choose the correct option??", options: ["Adamsia", "Jellyfish 🪼", "hydra", "Meandrina"], correct:0, image: "image1.jpg" },
    { question: "Choose the correct option??", options: ["Parietal", "Free central", "Marginal", "Basal"], correct: 0, image: "image2.jpg" },
    { question: "Choose the correct option??", options: ["Inner mitochondrial membrane", "Golgi body", "E.R ", "Ribosome"], correct:1, image: "image3.jpg" },
    { question: "Choose the correct option??", options: [" option 1", "Option 2", "Option 3", "Option 4"], correct: 3, image: "image4.jpg" },
];

let currentQuestionIndex = 0;
let score = 0;
let totalTime = 0;
let startTime;
let timer;
let timeLeft = 30;
let answered = false;

const questionElement = document.getElementById('question');
const choicesElement = document.getElementById('choices');
const imageElement = document.getElementById('question-image');
const timeElement = document.getElementById('time');
const resultElement = document.getElementById('result');
const submitButton = document.getElementById('submit');
const nextButton = document.getElementById('next');

function startTimer() {
    startTime = Date.now();
    timeLeft = 30;
    timeElement.textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timeElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            submitAnswer();  // Automatically submit the answer when time is up
        }
    }, 1000);
}

function loadQuestion() {
    const questionData = quizData[currentQuestionIndex];
    questionElement.textContent = questionData.question;
    imageElement.src = questionData.image;
    choicesElement.innerHTML = '';
    questionData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('choice');
        button.addEventListener('click', () => selectAnswer(index));
        choicesElement.appendChild(button);
    });
    submitButton.style.display = 'inline-block';
    nextButton.style.display = 'none';
    startTimer();
}

function selectAnswer(selectedIndex) {
    if (answered) return;  // Prevent multiple answers
    const choices = document.querySelectorAll('#choices button');
    choices.forEach((btn, index) => {
        if (index === selectedIndex) {
            btn.style.backgroundColor = '#007bff';  // Selected option
        } else {
            btn.style.backgroundColor = '#e0e0e0';  // Unselected options
        }
    });
}

function submitAnswer() {
    if (answered) return;  // Prevent multiple submissions
    clearInterval(timer);
    const selectedIndex = Array.from(document.querySelectorAll('#choices button')).findIndex(btn => btn.style.backgroundColor === 'rgb(0, 123, 255)');
    if (selectedIndex === -1) {
        resultElement.textContent = 'Please select an option!';
        resultElement.style.color = 'orange';
        return;
    }
    const correctIndex = quizData[currentQuestionIndex].correct;
    const timeSpent = Math.max(30 - timeLeft, 0);
    totalTime += timeSpent;
    if (selectedIndex === correctIndex) {
        score += 4;
        resultElement.textContent = 'Correct!';
        resultElement.style.color = 'green';
    } else {
        score -= 1;
        resultElement.textContent = 'Incorrect!';
        resultElement.style.color = 'red';
    }
    answered = true;
    submitButton.style.display = 'none';
    nextButton.style.display = 'inline-block';
}

function nextQuestion() {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
        answered = false;  // Reset for next question
    } else {
        showResults();
    }
}

function showResults() {
    const totalQuestions = quizData.length;
    const correctAnswers = quizData.filter((q, i) => document.querySelectorAll('#choices button')[quizData[i].correct].style.backgroundColor === 'rgb(0, 123, 255)').length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const accuracy = (correctAnswers / totalQuestions) * 100;
    const percentage = accuracy.toFixed(2);
    const totalTimeInMinutes = (totalTime / 60).toFixed(2);  // Convert to minutes for display

    document.querySelector('.quiz-container').innerHTML = `
        <h1>Quiz Complete</h1>
        <p>Total Time Taken: ${totalTime} seconds (${totalTimeInMinutes} minutes)</p>
        <p>Total Marks: ${totalQuestions * 4}</p>
        <p>Your Score: ${score}</p>
        <p>Correct Answers: ${correctAnswers}</p>
        <p>Incorrect Answers: ${incorrectAnswers}</p>
        <p>Accuracy: ${percentage}%</p>
    `;
    document.querySelector('.quiz-container').style.backgroundColor = '#f0f8ff';  // Change background color for results
}

loadQuestion();
