import React from "react";

export default function Home(props) {
  return (
    <div className="home-container">
      <h1 className="title">Quizzical</h1>
      <h4 className="description">
        Test your trivia knowledge with Quizzical! Answer 5 random questions and
        see how many you can get right. Challenge yourself and learn new facts
        in this quick and fun trivia game.
      </h4>
      <button className="button start" onClick={props.startQuiz}>
        Start quiz
      </button>
    </div>
  );
}
