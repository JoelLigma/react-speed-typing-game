import React, { useEffect } from "react";
import { useState, BrowserRouter, Route, Switch } from "react";
import "./App.scss";
import Game from "./Game/Game";
import TitleScreen from "./TitleScreen/TitleScreen";

const App = () => {
  const [isRunning, setIsRunning] = useState(false);

  const stopGame = () => {
    setIsRunning(false);
  };

  const startGame = () => {
    setIsRunning(true);
  };

  return (
    <div className="App">
      <main className="main">
        {isRunning === false ? (
          <TitleScreen clickHandler={startGame} />
        ) : (
          <Game clickHandler={stopGame} />
        )}
      </main>
    </div>
  );
};

export default App;
