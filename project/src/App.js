import React, { useEffect, useState } from 'react';
import './App.css';
import data from './Question.json'; 
import correct from './sounds/correct.mp3';
import wrong from './sounds/wrong.mp3';
import playMusic from './sounds/play.mp3';

function App() {
  const [username, setUsername] = useState(""); // Store the username
  const [currentLevel, setCurrentLevel] = useState(null); 
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectOption, setSelectOption] = useState(null);
  const [showScore, setShowScore] = useState(false);
  const [timer, setTimer] = useState(10);
  const [gameStarted, setGameStarted] = useState(false);
  const [levelCompleted, setLevelCompleted] = useState(false); 
  const [completedLevels, setCompletedLevels] = useState(0); 
  const [startPage, setStartPage] = useState(true); 
  const [showRewardPage, setShowRewardPage] = useState(false); 
  const [continueGame, setContinueGame] = useState(false); 
  const totalLevels = data.length; 
  const questionsPerLevel = data[currentLevel]?.questions.length || 0;

  useEffect(() => {
    let interval;
    if (gameStarted && timer > 0 && !showScore) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      handleTimeout();
    }
    return () => clearInterval(interval);
  }, [timer, gameStarted, showScore]);

  const handleTimeout = () => {
    if (currentQuestion < questionsPerLevel - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimer(10);
      setSelectOption(null);
    } else {
      moveToNextLevelOrFinish();
    }
  };

  const moveToNextLevelOrFinish = () => {
    if (currentLevel < totalLevels - 1) {
      setCurrentLevel((prev) => prev + 1);
      setCurrentQuestion(0);
      setTimer(10);
      setSelectOption(null);
    } else {
      setShowScore(true);
    }
  };

  const restartQuiz = () => {
    setCurrentLevel(0);
    setCurrentQuestion(0);
    setSelectOption(null);
    setScore(0);
    setShowScore(false);
    setTimer(10);
    setGameStarted(false);
    setLevelCompleted(false);
    setStartPage(false);
    setShowRewardPage(false); 
    setUsername(""); // Reset username
  };

  const handleClick = (option) => {
    setSelectOption(option);

    if (option === data[currentLevel].questions[currentQuestion].correctOption) {
      setScore((prev) => prev + 1);
      const audio = new Audio(correct);
      audio.play();
    } else {
      const audio = new Audio(wrong);
      audio.play();
    }
  };

  const startGame = (level) => {
    const audio = new Audio(playMusic);
    audio.play();
    setGameStarted(true);
    setCurrentLevel(level);
  };

  const handleLevelCompletion = () => {
    setLevelCompleted(true);
    setCompletedLevels((prev) => prev + 1); 
  };

  const handleExit = () => {
    setShowRewardPage(true);
  };

  const handleContinue = () => {
    setLevelCompleted(false); 
    setContinueGame(true); 
  };

  const handleCompleteQuiz = () => {
    setShowScore(true);
  };

  if (startPage) {
    return (
      <div className="get-started-page">
        <h1>Welcome to the Quiz Game!</h1>
        <p>Test your knowledge and progress through different levels.</p>
        <input className='input'
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="start-button"
          onClick={() => username.trim() && setStartPage(false)}
          disabled={!username.trim()}
        >
          Get Started
        </button>
      </div>
    );
  }

  if (showRewardPage) {
    return (
      <div className="reward-page">
        <h1>Congratulations, {username}!</h1>
        <p>You have completed the quiz game!</p>
        <p>Your reward: $100 🎉</p>
        <button onClick={restartQuiz}>Restart Game</button>
      </div>
    );
  }

  if (currentLevel === null) {
    return (
      <div className="levels-page">
        <h1>Select a Level to Start, {username}</h1>
        <div className="level-buttons">
          {data.map((levelData, index) => (
            <div key={index} className="level-container">
              <button onClick={() => startGame(index)}>
                Level {index + 1}
              </button>
              {index < completedLevels && (
                <span className="completed-levels">END QUIZ</span>
              )}
            </div>
          ))}
        </div>
        <div className="levels-status">
          <p>Levels Completed: {completedLevels}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`quiz-app ${gameStarted ? 'game-started' : ''}`}>
      {!gameStarted ? (
        <div className="welcome-section">
          <h1>Welcome to the Quiz Game, {username}!</h1>
          <p>Test your knowledge and have fun progressing through the levels!</p>
          <button className="start-button" onClick={() => startGame(0)}>
            Get Started
          </button>
        </div>
      ) : showScore ? (
        <div className="score-section">
          <h2>Congratulations, {username}!</h2>
          <p>Your Total Score: {score}/{totalLevels * questionsPerLevel}</p>
          <button onClick={restartQuiz}>Restart</button>
        </div>
      ) : (
        <div className="question-section">
          <h2>
            {username}, Level {currentLevel + 1} - Question {currentQuestion + 1}
          </h2>
          <p>{data[currentLevel].questions[currentQuestion].question}</p>
          <div className="options">
            {data[currentLevel].questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleClick(option)}
                style={{
                  backgroundColor:
                    selectOption === option
                      ? option === data[currentLevel].questions[currentQuestion].correctOption
                        ? 'green'
                        : 'red'
                      : '',
                }}
                disabled={!!selectOption}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="timer">Time Left: <span>{timer}</span></div>
          {levelCompleted && (
            <div className="level-completion">
              <p>Level {currentLevel + 1} Completed! 🎉</p>
              <button onClick={handleExit}>Exit to Reward Page</button>
              <button onClick={handleContinue}>Continue</button>
            </div>
          )}
          <button className="complete-button" onClick={handleCompleteQuiz}>
            Complete Quiz
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
