import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import data from '../data';

import "../styles/play.css"

const API_KEY = "dict.1.1.20220204T134754Z.fe20c29503ca8685.20a4447b4efb421ec3ac3bb5c554cbf7d626aecd"
const LETTERS = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'];
const PlayPage = () => {
    const params = useParams();
    const navigate = useNavigate();

    const [number, setNumber] = useState(parseInt(params.num));
    const [currentLetter, setCurrentLetter] = useState(null);

    const [correctWord, setCorrectWord] = useState(null);

    const [currentWord, setCurrentWord] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [wordToCheck, setWordToCheck] = useState(null);
    const [result, setResult] = useState(new Array(number).fill([]));
    const [wordBoard, setWordBoard] = useState(new Array(number).fill("").map( i => (new Array(number).fill(""))));

    const [correct, setCorrect] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const [goingHome, setGoingHome] = useState(false);

    const checkValid = async () => {
        console.log('check valid')
        const word = wordBoard[currentWord].join("")
        if (word.length < number) {
            return
        }
        console.log(word)
        await fetch( `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${API_KEY}&lang=en-en&text=${word}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.def.length > 0) {
                checkWord();
            } else {
                console.log('not valid')
            }
        });
    }

    useEffect(() => {
        console.log(number);
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
        console.log("check word")
        const word = wordBoard[currentWord];
        if (correctWord === word.join("")) {
            console.log("correct");
            setCorrect(true);
        } else if (currentWord + 1 === number) {
            console.log('gameover')
            setGameOver(true);
        }
        console.log(correctWord)
        const correctArray = correctWord.split("");
        let temp = new Array(number);
        for (let i=0; i < correctArray.length; i++) {
            if (correctArray[i] === word[i]) {
                temp[i] = 'correct';
            } else if (correctArray.includes(word[i])) {
                temp[i] = 'wrong-place';
            } else {
                temp[i] = 'wrong';
            }
        }

        let tempResult = result;
        console.log(tempResult);
        tempResult[currentWord] = temp;

        console.log('set result')
        setResult([...tempResult]);
        setCurrentIndex(0);
        setCurrentWord(currentWord + 1);

    }

    useEffect(() => {
        let wordIndex = currentWord;
        let letterIndex = currentIndex;
        let temp = wordBoard[wordIndex];
        console.log(wordIndex, letterIndex);

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
        console.log(tempBoard)

        setWordBoard(tempBoard);

    }, [currentLetter]);


    const reset = () => {
        setResult(new Array(number).fill([]));
        setWordBoard(new Array(number).fill("").map( i => (new Array(8).fill(""))));

        setCurrentIndex(0);
        setCurrentWord(0);
        setCorrectWord(null);

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
            { wordBoard.map( (item, i) => (
                <Word number={number} key={i} wordIndex={i} currentLetter={currentLetter} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} currentWord={currentWord} result={result} wordBoard={wordBoard} setWordBoard={setWordBoard} />
            ))}
        </div>
        <KeyBoard setCurrentLetter={setCurrentLetter} checkValid={checkValid} number={number} currentIndex={currentIndex} />
    </div>
    { gameOver && <GameOverMenu reset={reset} correctWord={correctWord} correct={correct} /> }
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


    return <div className={`play-letter ${selected ? "selected" : ""} ${classList && classList[index]}`} >
        <p>{letter}</p>
    </div>
}

const KeyBoard = ({setCurrentLetter, checkValid, number, currentIndex}) => {

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
                <KeyBoardLetter index={i} key={i} rowOffset={0} setCurrentLetter={setCurrentLetter} />
            ))}
        </div>
        <div className='keyboard-row'>
            { new Array(9).fill(1).map( (item, i) => (
                <KeyBoardLetter index={i} key={i} rowOffset={10} setCurrentLetter={setCurrentLetter} />
            ))}
        </div>
        <div className='keyboard-row'>
            { new Array(7).fill(1).map( (item, i) => (
                <KeyBoardLetter index={i} key={i} rowOffset={19} setCurrentLetter={setCurrentLetter} />
            ))}
            <DeleteLetter setCurrentLetter={setCurrentLetter} />
        </div>
        <button className='checkBtn' onClick={checkValid} disabled={currentIndex < number} >Enter</button>
    </div>
}

const KeyBoardLetter = ({ index, rowOffset, setCurrentLetter }) => {
    const letter = LETTERS[index + rowOffset];

    const click = () => {
        setCurrentLetter([...letter]);
    }

    return <div className='keyboard-letter' onClick={click}>
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