import "./Game.scss";
import axios from "axios";
import React, { useState, useRef, useEffect } from "react";

const Game = (props) => {
  let countdown = 30;
  const [level, setLevel] = useState(1);

  // TIMER
  const timerRef = useRef(null);
  const timeoutRef = useRef(null);
  const [timer, setTimer] = useState(countdown);

  /**
   * Clears any existing intervals, sets a new interval, and update the timer ref
   */
  const startTimer = () => {
    if (timerRef.current) {
      //   console.log("CLEARING INTERVAL...");
      clearInterval(timerRef.current);
    }

    const id = setInterval(() => {
      console.log("internval step");
      setTimer((prevTime) => prevTime - 1);
      setDenumerator((prevDenum) => prevDenum + 1);
    }, 1000);
    timerRef.current = id;
  };

  // // RANDOM QUOTES
  const [sentence, setSentence] = useState("");

  /**
   * Fetches a random sentance from the API
   *
   * @returns
   */
  const getSentence = () => {
    setSentence("test");
    return;
    axios
      .get("https://api.quotable.io/random")
      .then((response) => {
        setSentence((prevSentence) => (prevSentence = response.data.content));
      })
      .catch((error) => console.log(error));
  };

  /**
   * Apply colours to the users text if it's correct/incorrect
   *
   * @param {*} input
   * @param {*} givenSentence
   * @returns
   */
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

  /**
   * Resets the current level & timer
   *
   * @param {*} setInput
   * @param {*} setSentence
   * @param {*} timerRef
   */
  function resetLevel(setInput, setSentence, timerRef) {
    setInput("");
    setSentence("");
    resetTimer(timerRef, timeoutRef);
    setTimer(30);
    timerRef.current = null;
  }

  /**
   * Reset the counter
   *
   * @param {*} timerRef
   * @param {*} timeoutRef
   */
  function resetTimer(timerRef, timeoutRef) {
    clearInterval(timerRef.current);
    clearTimeout(timeoutRef.current);
  }

  // // DENUMATOR (for characters per minute)
  const [denumerator, setDenumerator] = useState(0);

  /**
   * Count how many words the user has typed
   *
   * @param {*} input
   * @returns
   */
  const countWords = (input) => {
    if (!input) {
      return 0;
    }
    return input.split(" ").length;
  };

  // INPUT FIELD
  const [input, setInput] = useState("");
  const [charCount, setCharCount] = useState(0);

  /**
   * Update the state based on what the user has typed
   *
   * @param {Event} e
   */
  const inputChangeHandler = (e) => {
    // e.preventDefault();
    setInput((prevInput) => (prevInput = e.target.value));
    setCharCount((prevCount) => (prevCount = e.target.value.length));
  };

  /**
   * Check if the user has finished the level
   *
   * TODO:
   *
   * @param {*} input
   * @param {*} givenSentence
   * @returns
   */
  const levelCompleted = (input, givenSentence) => {
    // console.log(input, givenSentence);

    return input === givenSentence;
  };

  /**
   * ...
   *
   * @param {*} input
   * @param {*} sentence
   * @returns
   */
  const renderInputField = (input, sentence) => {
    if (timer > 0 && levelCompleted(input, sentence)) {
      return <p className="game__output game__output--won">{input}</p>;
    } else if (timer > 0) {
      return (
        <textarea
          className="game__input"
          autoFocus
          onChange={inputChangeHandler}
        ></textarea>
      );
    } else {
      return <p className="game__output game__output--lost">{input}</p>;
    }
  };

  const updateLocalStorage = (level) => {
    if (!localStorage.getItem("highscore")) {
      localStorage.setItem("highscore", level);
    }

    if (level > localStorage.getItem("highscore")) {
      localStorage.setItem("highscore", level);
    }
  };

  // use effect block
  useEffect(() => {
    // initial setup on mount
    if (timerRef.current === null) {
      getSentence();
      startTimer();
    }

    // if timer runs out and players loses, stop timers
    if (timer === 0) {
      resetTimer(timerRef, timeoutRef);
      updateLocalStorage(level);
    }

    const levelIsCompleted =
      timer > 0 &&
      input !== "" &&
      sentence !== "" &&
      levelCompleted(input, sentence);

    if (levelIsCompleted) {
      console.log("INCREMENTING LEVEL...");
      console.log(`Timer: ${timer}`);
      setLevel((prevLevel) => prevLevel + 1);
      updateLocalStorage(level);

      // resets
      resetTimer(timerRef, timeoutRef);
      resetLevel(setInput, setSentence, timerRef);
    }

    // if (level > 1) {
    //   clearInterval(timerRef.current);
    //   clearTimeout(timeoutRef.current);
    // }

    // TODO:
    // if (levelCompleted(input, sentence)) {
    //   clearInterval(timerRef.current);
    //   clearTimeout(timeoutRef.current);
    // }

    // return () => {
    //   console.log("Unmounting...");
    //   // Stoping the interval
    //   resetTimer();
    // };
  }, [timer, level]);

  return (
    <section className="game">
      {/* <Game /> */}
      {/* <Finished /> */}
      <h1 className="game__title">🏎️💨 Speed Typing Game</h1>
      <h2 className="game__level">Level {level}</h2>
      <p className="game__timer">{timer}</p>
      <p className="game__text">{applySpan(input, sentence)}</p>
      {renderInputField(input, sentence)}
      <div className="game__container">
        <p className="game__stats">
          Characters per minute: {Math.floor(charCount / (denumerator / 60))}
        </p>
        <p className="game__stats">
          Words per minute: {Math.floor(countWords(input) / (denumerator / 60))}
        </p>
        <p className="game__streak">
          Best Streak:{" "}
          {localStorage.getItem("highscore")
            ? localStorage.getItem("highscore")
            : 0}
        </p>
      </div>
      <button className="game__button" onClick={props.clickHandler}>
        Finish
      </button>
    </section>
  );
};

export default Game;
