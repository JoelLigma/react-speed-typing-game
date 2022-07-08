// import { Link } from "react-router-dom";
import "./TitleScreen.scss";

const TitleScreen = (props) => {
  return (
    <>
      <section className="titlescreen">
        <h1 className="titlescreen__title">🏎️💨 Speed Typing Game</h1>
        {/* <Link to="/game"> */}
        <div className="titlescreen__container">
          <button onClick={props.clickHandler} className="titlescreen__button">
            Start Game
          </button>
        </div>
        {/* </Link> */}
      </section>
    </>
  );
};

export default TitleScreen;
