// import "regenerator-runtime/runtime"; // Import at the very top
import React from "react";
import { nanoid } from "nanoid";
import { decode } from "html-entities";
import Confetti from "react-confetti";
import Home from "../components/Home";
import Question from "../components/Question";

export default function App() {
  const [screen, setScreen] = React.useState("home");
  const [questions, setQuestions] = React.useState([]);
  const [showResults, setShowResults] = React.useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = React.useState(0);

  const styles = {
    backgroundSize:
      screen === "home" ? "18em auto, 16em auto" : "12em auto, 10em auto",
  };

  React.useEffect(() => {
    if (screen === "questionsScreen") {
      async function getQuestions() {
        try {
          const res = await fetch("https://opentdb.com/api.php?amount=5");
          const data = await res.json();
          const decodedQuestions = data.results.map((question) => {
            const answers = [
              ...question.incorrect_answers,
              question.correct_answer,
            ].map((answer) => ({
              value: decode(answer),
              isSelected: false,
            }));
            const correctAnswerIndex = Math.floor(
              Math.random() * answers.length
            );
            [answers[correctAnswerIndex], answers[answers.length - 1]] = [
              answers[answers.length - 1],
              answers[correctAnswerIndex],
            ];

            return {
              ...question,
              question: decode(question.question),
              correct_answer: decode(question.correct_answer),
              answers: answers,
              id: nanoid(),
            };
          });
          setQuestions(decodedQuestions);
        } catch (error) {
          console.error("Error fetching questions:", error);
        }
      }
      getQuestions();
    }
  }, [screen]);

  function startQuiz() {
    setScreen("questionsScreen");
  }

  function handleSelectAnswer(questionId, answerValue) {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) => {
        if (question.id === questionId) {
          return {
            ...question,
            answers: question.answers.map((answer) => ({
              ...answer,
              isSelected: answer.value === answerValue,
            })),
          };
        }
        return question;
      })
    );
  }

  console.log(`Questions: ${JSON.stringify(questions, null, 2)}`);
  const questionElements = questions.map((question, index) => (
    <Question
      key={question.id}
      questionNumber={index + 1}
      question={question.question}
      answers={question.answers}
      correctAnswer={question.correct_answer}
      showResults={showResults}
      handleSelectAnswer={(answerValue) =>
        handleSelectAnswer(question.id, answerValue)
      }
    />
  ));

  function checkAnswers() {
    setShowResults(true);
    let count = 0;
    questions.forEach((qs) => {
      if (qs.correct_answer === qs.answers.find((a) => a.isSelected).value)
        count++;
    });

    setCorrectAnswersCount(count);
  }

  function playAgain() {
    setShowResults(false);
    setCorrectAnswersCount(0);
    setScreen("home");
  }

  return (
    <main style={styles}>
      {(correctAnswersCount > 0 && correctAnswersCount) ===
        questions.length && <Confetti />}
      {screen === "home" && <Home startQuiz={startQuiz} />}
      {screen === "questionsScreen" && (
        <div className="main-questions">
          <div className="questions-container">{questionElements}</div>
          <div className="result">
            {showResults && (
              <h2>{`You scored ${correctAnswersCount}/${questions.length} correct answers`}</h2>
            )}
            <button
              className="button check-answers"
              onClick={showResults ? playAgain : checkAnswers}
            >
              {showResults ? "Play again" : "Check Answers"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
