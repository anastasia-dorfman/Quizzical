import React from "react";

export default function Question(props) {
  function selectAnswer(answerValue) {
    props.handleSelectAnswer(answerValue);
  }

  const answersElements = props.answers.map((answer) => {
    const styles = {
      backgroundColor: !props.showResults
        ? answer.isSelected
          ? "#D6DBF5"
          : "transparent"
        : answer.isSelected
        ? answer.value === props.correctAnswer
          ? "#94D7A2"
          : "#F8BCBC"
        : answer.value === props.correctAnswer
        ? "#94D7A2"
        : "transparent",
      color:
        !props.showResults ||
        (props.showResults && answer.value === props.correctAnswer)
          ? "#293264"
          : "#8a9cb0",
      border: answer.isSelected
        ? "none"
        : props.showResults
        ? "1px solid #dbdef0"
        : "1px solid #293264",
      cursor: props.showResults ? "default" : "pointer",
      pointerEvents: props.showResults ? "none" : "auto",
    };
    return (
      <span
        key={answer.value}
        className="answer"
        style={styles}
        onClick={() => selectAnswer(answer.value)}
      >
        {answer.value}
      </span>
    );
  });

  return (
    <>
      <h5 className="question">
        {props.questionNumber}. {props.question}
      </h5>
      <div className="answer-container">{answersElements}</div>
      <hr />
    </>
  );
}
