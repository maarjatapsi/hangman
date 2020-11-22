// Singleton
class State {
    constructor(correct, wrongCount) {
        this.correct = correct;
        this.wrongCount = wrongCount;
        State.instance = this;
    }

    static getInstance() {
        if(!State.instance) {
            State.instance = new State(0,7);
        }
        return State.instance;
    }
}

// Gets the word that the user will guess
function getWord(){
    let xhr = new XMLHttpRequest();
    const key = "ab0d5274c4e036127a40d059f3c06ea27056d56b0e0300d75" // API key goes here
    const url = "https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key="+key;
    xhr.open('GET',url,true);

    xhr.onload = function(){
        if(this.status == 200){
            let data = JSON.parse(this.responseText);
            if(checkWord(data["word"])){
                playGame(data["word"]);
            } else {
                getWord();
            }
        }
        else {
            console.log("Connection Error");
        }
    }
    xhr.send();
}

// The game being played
function playGame(word){
    const state = State.getInstance();
    document.getElementById('panel_1').innerHTML = `<h1>${state.wrongCount}</h1>`;
    let wordArray = word.toUpperCase().split("");
    let guessArray = [];
    for(let i in word){
        guessArray.push("_");
    }
    setGuess(guessArray);
    var letters = document.getElementsByClassName('btn-light');
    for(let letter of letters){
        letter.onclick = function(){
            letter.disabled = true;
            let guess = this.firstChild.nodeValue;
            if(word.toUpperCase().indexOf(guess) > -1){
                checkGuess(guess, wordArray, guessArray)
                this.style.background = "green";
            } else {
                this.style.background = "red";
                state.wrongCount--;
            }
            document.getElementById('panel_1').innerHTML = `<h1>${state.wrongCount}</h1>`;
            if(state.correct == wordArray.length){endGame(true, word);}
            else if(state.wrongCount <= 0) {endGame(false, word);}
        }
    }
}

// Checks if the word is valid and playable
function checkWord(word){
    if(word.length > 12){return false;}
    let badChars = [" ","-",",",".","/"];
    for(let char of badChars){
        if(word.indexOf(char) > -1){return false;}
    }
    return true;
}

// Checks if the guessed letter is in the word
function checkGuess(guess, wordArray, guessArray){
    const state = State.getInstance()
    for(let i in wordArray){
        if(wordArray[i] == guess){
            guessArray[i] = guess;
            state.correct++;
        }
    }
    setGuess(guessArray);
}

// Places correctly guessed letters into the correct spaces
function setGuess(guessArray){
    let output = "";
    for(let char of guessArray){ output += char + " ";}
    document.getElementById('guessString').innerHTML = `${output}`;
}

// Called when the game is over
function endGame(result, word){
    if(result){
        document.getElementById('panel_1').innerHTML = `<h1>You won!</h1>`;
    } else {
        document.getElementById('panel_1').innerHTML = `<h1>You lost!</h1>`;
        document.getElementById('guessString').innerHTML = `${word.toUpperCase()}`;
    }
}
