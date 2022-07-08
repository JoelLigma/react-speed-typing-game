import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import "./App.scss";

const App = () => {
  // FIXME: experimental
  let staticDenum = null;
  let countdown = 15;

  // TIMER
  // We need ref in this, because we are dealing
  // with JS setInterval to keep track of it and
  // stop it when needed
  const timerRef = useRef(null);
  const timeoutRef = useRef(null);
  const [timer, setTimer] = useState(countdown);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const id = setInterval(() => {
      setTimer((prevTime) => prevTime - 1);
      setDenumerator((prevDenum) => (timer > 1 ? prevDenum + 1 : staticDenum));
    }, 1000);
    timerRef.current = id;
  };

  // RANDOM QUOTES
  const [sentence, setSentence] = useState("");

  const getSentence = () => {
    axios
      .get("https://api.quotable.io/random")
      .then((response) => {
        setSentence((prevSentence) => (prevSentence = response.data.content));
      })
      .catch((error) => console.log(error));
  };

  const applySpan = (input, givenSentence) => {
    let inputArray = input.split("");
    let out = inputArray.map((char, i) => {
      if (char === givenSentence[i]) {
        return (
          <span key={i} className="game__char--correct">
            {char}
          </span>
        );
      } else {
        return (
          <span key={i} className="game__char--incorrect">
            {char}
          </span>
        );
      }
    });
    for (let i = out.length; i < givenSentence.length; i++) {
      out.push(
        <span key={i} className="game__char">
          {givenSentence[i]}
        </span>
      );
    }
    return out;
  };

  // DENUMATOR (for characters per minute)
  const [denumerator, setDenumerator] = useState(0);

  const countWords = (input) => {
    if (!input) {
      return 0;
    }
    return input.split(" ").length;
  };

  //INPUT FIELD
  const [input, setInput] = useState("");
  const [charCount, setCharCount] = useState(0);

  const keyboardInput = (e) => {
    e.preventDefault();
    setInput((prevInput) => (prevInput = e.target.value));
    setCharCount((prevCount) => (prevCount = e.target.value.length));
  };

  // check if player passed the level
  const hasPassed = (input, givenSentence) => {
    if (input === givenSentence) {
      return true;
      // stop timer
      // +1 to current streak
      // go on to the next round -> repeat
    }
    return false;
  };

  const renderInputField = (input, sentence) => {
    if (timer > 0 && hasPassed(input, sentence)) {
      return <p className="game__output game__output--won">{input}</p>;
    } else if (timer > 0) {
      return (
        <textarea
          className="game__input"
          autoFocus
          onChange={keyboardInput}
        ></textarea>
      );
    } else {
      return <p className="game__output game__output--lost">{input}</p>;
    }
  };

  useEffect(() => {
    // componentDidMount()

    console.log(timerRef);

    if (timerRef.current === null) {
      getSentence();
      timeoutRef.current = setTimeout(() => startTimer(), 1000);
    }

    if (timer === 0) {
      clearInterval(timerRef.current);
      clearTimeout(timeoutRef);
    }

    // clear interval aka componentWillUnmount()
    // return () => {
    //   clearInterval(timerRef.current);
    //   clearTimeout(timeoutRef);
    // };
  }, [timer]);

  return (
    <div className="App">
      <main className="main">
        <section className="game">
          {/* <Game /> */}
          {/* <Finished /> */}
          <h1 className="game__title">🏎️💨 Speed Typing Game</h1>
          <p className="game__timer">{timer}</p>
          <p className="game__text">{applySpan(input, sentence)}</p>
          {renderInputField(input, sentence)}
          <div className="game__container">
            <p className="game__stats">
              Characters per minute:{" "}
              {Math.floor(charCount / (denumerator / 60))}
            </p>
            <p className="game__stats">
              Words per minute:{" "}
              {Math.floor(countWords(input) / (denumerator / 60))}
            </p>
            <p className="game__streak">Best Streak: {0}</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;

// TODO:
// stop timer when time runs out
// go on to next level when successful
// before it starts press button to start
// store highest streak in session storage or local storage
