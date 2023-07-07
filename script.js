// Initialize the current question index, score, high scores from local storage,
//  quiz data, user name and selected option
let currentQuestion = 0;
let score = 0;
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
let quizData = [];
let userName = "";
let selectOption = "";


// clicking parts
const startPage = document.getElementById('start-page');
const startQuizBtn = document.getElementById('start-btn');

// inside the quiz container.
const quizContainer = document.getElementById('quiz-container');
const resultMessage = document.getElementById('message');

//function laod quiz frm quizdata.json file.
 async function loadQuizData(){
     const res = await fetch('quizData.json');
     quizData = await res.json();
     loadQuestion();
}

// function to load the current question and options
function loadQuestion(){
      const questionObj = quizData[currentQuestion];
      document.getElementById('question').innerText = questionObj.question;
      for(let i=0; i<4; i++){
        const btn = document.getElementById(`btn${i}`);
        btn.innerText = questionObj.options[i];
        btn.className = 'option-btn';
        btn.disabled = false;
        btn.style.opacity = 1;
        btn.style.cursor = 'default';
      }
      document.getElementById('message').innerText = '';
      document.getElementById('next-btn').style.display = 'none';
};

//function to start the quiz get the usnername and display quizs
function startQuiz(){
    userName = prompt('Enter your username');
    if(userName.trim()){
        startPage.style.display = 'none';
        quizContainer.style.display = 'block';
        loadQuizData();
    }else{
        alert('please fill userName');
    }
};

//function will be end the Quiz.we
function endQuiz(){
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("score-container").style.display = "block";
    document.getElementById("final-score").innerText = score;

    // const backBtn = document.getElementById("back-btn");
    // backBtn.addEventListener('click',()=>{
    //     const a = document.createElement('a');
    //     a.innerText = "Go Back";
    //     a.class = "anchortag";
    //     a.href = "./index.html";
    //     backBtn.append(a);
    // });
const highScore = Math.max(...highScores.map((item) => item.score), score);
document.getElementById("final-high-score").innerText = highScore;
highScores.push({
  username: userName,
  score: score,
  date: new Date().toISOString(),
});
highScores.sort((a, b) => new Date(b.date) - new Date(a.date));
localStorage.setItem("highScores", JSON.stringify(highScores));
};

// Function to show high scores page with all the scores from local storage
const showHighscores = () => {
document.getElementById("start-page").style.display = "none";
document.getElementById("highscore-page").style.display = "block";
document.getElementById("highscores").innerHTML = highScores
  .map(
    (item) =>
      `<p>${item.username}: ${item.score} (on ${new Date(
        item.date
      ).toLocaleDateString()} at ${new Date(
        item.date
      ).toLocaleTimeString()})</p>`
  )
  .join("");

if (highScores.length == 0) {
  document.getElementById("highscores").innerHTML =
    "<h3>No Scores Yet!</h3><h4>Play the game to see your score's here.</h4>";
}
};


startQuizBtn.addEventListener('click', startQuiz);
document.getElementById("highscore-btn").addEventListener("click", showHighscores);

//event listener for the options buttons , updating score and showing wheater the ans is correct or not
for(let i=0; i<4; i++)
{
    document.getElementById(`btn${i}`).addEventListener('click', (event)=>{
        let selectOption = event.target;
        if(quizData[currentQuestion].answer===selectOption.innerText){
            score++;
            resultMessage.innerText = "Correct Answer";
            document.getElementById('score').innerText = score;
            selectOption.className = 'option-btn correct';
        }else{
           selectOption.className = 'option-btn wrong';
            resultMessage.innerText = "Wrong Answer";
        }
        for(let j=0; j<4; j++){
             document.getElementById(`btn${j}`).style.disabled = true;
            document.getElementById(`btn${j}`).style.cursor = 'not-allowed';
            document.getElementById(`btn${j}`).style.opacity = 0.5;
        }

        selectOption.style.opacity = 1;
        document.getElementById('next-btn').style.display = 'block';
    });
};


//event listener for next questions btn.
document.getElementById('next-btn').addEventListener('click', ()=>{
    currentQuestion++;
    if(currentQuestion < quizData.length){
        loadQuestion();
        const progress = (currentQuestion / quizData.length * 100);
        document.getElementById('progress-bar-fill').style.width = `${progress}%`;
        document.getElementById('progress-bar-text').innerText = `${Math.round(progress)}%`
    }else{
        endQuiz();
    }
})