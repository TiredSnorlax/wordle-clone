import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import data from '../data';

import "../styles/play.css"

const LETTERS = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'];
const PlayPage = ({number}) => {
    const navigate = useNavigate();

    const [currentLetter, setCurrentLetter] = useState(null);

    const [correctWord, setCorrectWord] = useState(null);

    const [currentWord, setCurrentWord] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [correctLetters, setCorrectLetters] = useState([]);
    const [wrongLetters, setWrongLetters] = useState([]);
    const [placeLetters, setPlaceLetters] = useState([]);

    const [result, setResult] = useState(new Array(number + 1).fill([]));
    const [wordBoard, setWordBoard] = useState(new Array(number + 1).fill("").map( i => (new Array(number).fill(""))));

    const [correct, setCorrect] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const [goingHome, setGoingHome] = useState(false);
    const [message, setMessage] = useState(null);

    const checkValid = async () => {
        const word = wordBoard[currentWord].join("")
        fetch(`https://mashape-community-urban-dictionary.p.rapidapi.com/define?term=${word}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "mashape-community-urban-dictionary.p.rapidapi.com",
                "x-rapidapi-key": process.env.REACT_APP_KEY
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data && data["list"].length > 0) {
                checkWord();
            } else {
                console.log('not valid')
                setMessage("Not a valid word")
            }
        });
    }

    useEffect(() => {
        // if (!number) {
        //     setNumber(parseInt(params.num));
        // }
        if (!correctWord) {
            const dataSet = Array.from(new Set(data[number]));
            setCorrectWord(dataSet[Math.floor(Math.random() * dataSet.length)])
            console.log("correct word set")
        }

    }, [correctWord]);



    const checkWord = async () => {
        const word = wordBoard[currentWord];
        if (correctWord === word.join("")) {
            setCorrect(true);
            setGameOver(true);
        } else if (currentWord === number) {
            setGameOver(true);
        }
        const correctArray = correctWord.split("");
        let correctObject = {};

        let correctLettersIndex = {};

        for (let i=0; i < correctArray.length; i++) {
            correctObject[correctArray[i]] = correctArray.filter(word => word === correctArray[i])
            correctLettersIndex[correctArray[i]] = [];
        };

        let temp = new Array(number);
        let _correctLetters = correctLetters;
        let _wrongLetters = wrongLetters;
        let _placeLetters = placeLetters;
        for (let i=0; i < correctArray.length; i++) {
            if (correctArray[i] === word[i]) {
                temp[i] = 'correct checking';
                correctLettersIndex[correctArray[i]].push(i);
                _correctLetters.push(word[i]);
            } else if (!correctArray.includes(word[i])) {
                temp[i] = 'wrong checking';
                _wrongLetters.push(word[i]);
            }
        }

        for (let i=0; i < correctArray.length; i++) {
            if (correctArray.includes(word[i]) && correctObject[word[i]].length > correctLettersIndex[word[i]].length && correctObject[word[i]].length > _placeLetters.filter(w=>w===word[i]).length ) {
                temp[i] = 'wrong-place checking';
                _placeLetters.push(word[i]);
            } else if (correctLettersIndex[word[i]] && !correctLettersIndex[word[i]].includes(i)) {
                temp[i] = "wrong checking"
            }
        }

        let tempResult = result;
        tempResult[currentWord] = temp;

        setCorrectLetters([..._correctLetters]);
        setWrongLetters([..._wrongLetters]);
        setPlaceLetters([..._placeLetters]);

        setResult([...tempResult]);
        setCurrentIndex(0);
        setCurrentWord(currentWord + 1);

    }

    useEffect(() => {
        let wordIndex = currentWord;
        let letterIndex = currentIndex;
        let temp = wordBoard[wordIndex];

        if (currentLetter ) {
            if ( currentLetter[0] && letterIndex < number ) {
                temp[letterIndex] = currentLetter[0];
                setCurrentIndex(letterIndex + 1);
            } else if (!currentLetter[0]) {
                if (letterIndex > 0 || letterIndex >= number) {
                    temp[letterIndex - 1] = "";
                    setCurrentIndex(letterIndex - 1);
                }
            }
        }

        let tempBoard = wordBoard;
        tempBoard[currentWord] = temp;

        setWordBoard(tempBoard);

    }, [currentLetter]);


    const reset = () => {
        setResult(new Array(number + 1).fill([]));
        setWordBoard(new Array(number + 1).fill("").map( i => (new Array(number).fill(""))));

        setCurrentIndex(0);
        setCurrentWord(0);
        setCorrectWord(null);

        setCorrectLetters([]);
        setWrongLetters([]);
        setPlaceLetters([]);

        setCorrect(false);
        setGameOver(false);
    }

    const goBackHome = () => {
        setGoingHome(true);

        document.querySelector("body").style.overflow = "hidden";
        document.querySelector(".App").style.overflow = "hidden";
        setTimeout(() => {
            navigate(`/`);
            document.querySelector("body").style.overflowY = "auto";
            document.querySelector(".App").style.overflowY = "auto";
        }, 600);
    }



  return <>
    <div className={`play-content-container ${number ? `num-${number}` : ""}` }>
        <div className={`backBtn ${goingHome ? "goingHome" : ""} `} onClick={goBackHome}><span className='fas fa-arrow-left'></span></div>
        <div className='play-word-container'>
            { wordBoard && wordBoard.map( (item, i) => (
                <Word number={number} key={i} wordIndex={i} currentLetter={currentLetter} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} currentWord={currentWord} result={result} wordBoard={wordBoard} setWordBoard={setWordBoard} />
            ))}
        </div>
        <KeyBoard setCurrentLetter={setCurrentLetter} checkValid={checkValid} number={number} currentIndex={currentIndex} correctLetters={correctLetters} wrongLetters={wrongLetters} placeLetters={placeLetters} />
    </div>
    { gameOver && <GameOverMenu reset={reset} correctWord={correctWord} correct={correct} /> }
    { message && <Message message={message} setMessage={setMessage} /> }
  </>;
};

export default PlayPage;


    // number -> number of letters
    // wordIndex -> index of word
    // currentLetter -> letter pressed by keyboard
    // currentIndex -> index of current letter
    // currentWord -> index of current word
    // setWordToCheck -> array of word typed out so far
    // result -> array containing classnames that show results


const Word = ({ wordIndex, currentIndex, currentWord, setWordToCheck, result, wordBoard }) => {
    const [classList, setClassList] = useState(null);


    useEffect(() => {
        if (result && result[wordIndex]) {
            setClassList(result[wordIndex]);
        }
    }, [result]);






    return <div className='play-word'>
        { wordBoard[wordIndex].map( (letter, i) => (
            <Letter key={i} currentIndex={currentIndex} wordIndex={wordIndex} currentWord={currentWord} index={i} classList={classList} letter={letter} />
        ))}
    </div>
}

const Letter = ({ index, currentIndex, wordIndex, currentWord, classList, letter }) => {
    const [selected, setSelected] = useState(false);

    useEffect(() => {
        if (currentIndex === index && wordIndex === currentWord) {
            setSelected(true);
        } else {
            setSelected(false);
        }
    }, [currentIndex, currentWord]);


    return <div className={`play-letter ${selected ? "selected" : ""} ${classList && classList[index]}`} style={{ '--i': `${index}` }} >
        <p>{letter}</p>
    </div>
}

const KeyBoard = ({setCurrentLetter, checkValid, number, currentIndex, correctLetters, wrongLetters, placeLetters}) => {

    useEffect(() => {
        window.addEventListener("keydown", (event) => {
            if (LETTERS.includes(event.key)) {
                setCurrentLetter([...event.key]);
            } else if (event.key === "Backspace" || event.key === "Delete") {
                setCurrentLetter([null]);
            }
        })
    }, []);


    return <div className='keyboard'>
        <div className='keyboard-row'>
            { new Array(10).fill(1).map( (item, i) => (
                <KeyBoardLetter index={i} key={i} rowOffset={0} setCurrentLetter={setCurrentLetter} correctLetters={correctLetters} wrongLetters={wrongLetters} placeLetters={placeLetters} />
            ))}
        </div>
        <div className='keyboard-row'>
            { new Array(9).fill(1).map( (item, i) => (
                <KeyBoardLetter index={i} key={i} rowOffset={10} setCurrentLetter={setCurrentLetter} correctLetters={correctLetters} wrongLetters={wrongLetters} placeLetters={placeLetters} />
            ))}
        </div>
        <div className='keyboard-row'>
            { new Array(7).fill(1).map( (item, i) => (
                <KeyBoardLetter index={i} key={i} rowOffset={19} setCurrentLetter={setCurrentLetter} correctLetters={correctLetters} wrongLetters={wrongLetters} placeLetters={placeLetters} />
            ))}
            <DeleteLetter setCurrentLetter={setCurrentLetter} />
        </div>
        <button className='checkBtn' onClick={checkValid} disabled={currentIndex < number} >Enter</button>
    </div>
}

const KeyBoardLetter = ({ index, rowOffset, setCurrentLetter, correctLetters, wrongLetters, placeLetters }) => {
    const letter = LETTERS[index + rowOffset];
    const [letterClass, setLetterClass] = useState();

    useEffect(() => {
        if (correctLetters.includes(letter)) {
            setLetterClass("correct");
        } else if (wrongLetters.includes(letter)) {
            setLetterClass("wrong");
        } else if ( placeLetters.includes(letter)) {
            setLetterClass("place")
        } else {
            setLetterClass("");
        }
    }, [correctLetters, wrongLetters, placeLetters]);


    const click = () => {
        setCurrentLetter([...letter]);
    }

    return <div className={'keyboard-letter ' + letterClass} onClick={click}>
        <p>{letter}</p>
    </div>
}

const DeleteLetter = ({ setCurrentLetter }) => {
    const click = () => {
        setCurrentLetter([null]);
    }

    return <div className='keyboard-letter' onClick={click}>
        <p><span className="fas fa-times"></span></p>
    </div>
}

const GameOverMenu = ({reset, correctWord, correct }) => {

    return <div className='game-over-menu-container'>
        <div className='game-over-menu'>
            <h2>{ correct ? "You win!" : "Game Over" }</h2>
            <p>The word was <span>{correctWord}</span></p>
            <button onClick={reset}>Play again</button>
        </div>
    </div>
}

const Message = ({ message, setMessage }) => {

    useEffect(() => {
        setTimeout(() => {
            setMessage(null);

        }, 1200);
    }, []);


    return <>
        <div className='message'>{message}</div>
    </>

}