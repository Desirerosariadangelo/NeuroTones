let sequence = [];
let userSequence = [];
let currentLevel = 1;
let score = 0;
let isUserTurn = false;

const startButton = document.getElementById("start-button");
const buttonContainer = document.getElementById("buttons-container");
const scoreDisplay = document.getElementById("score");
const replayButton = document.getElementById("replay-button");
const messageDisplay = document.getElementById("message");

startButton.addEventListener('click', startGame);
replayButton.addEventListener('click', restartGame);

function generateSequence(level) {
    sequence = [];
    for (let i = 0; i < level; i++) {
        sequence.push(Math.floor(Math.random() * 4) + 1); // Genera numeri tra 1 e 4
    }
}

function createButtons() {
    buttonContainer.innerHTML = ""; // Pulisce i bottoni precedenti

    for (let i = 1; i <= 4; i++) {
        let button = document.createElement("button");
        button.classList.add("button");
        button.textContent = `${i}`;
        button.onclick = () => playSound(i);
        buttonContainer.appendChild(button);
    }
}

function playSound(number) {
    if (!isUserTurn) return;

    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(200 + number * 100, audioContext.currentTime); // Frequenze diverse per ogni suono
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);

    userSequence.push(number);
    checkSequence();
}

function checkSequence() {
    if (userSequence.length === sequence.length) {
        if (arraysAreEqual(sequence, userSequence)) {
            score++; // Aumenta il punteggio
            scoreDisplay.innerText = `Score: ${score}`; // Aggiorna il punteggio
            messageDisplay.innerText = `Corretto :D Score: ${score}`;
            currentLevel++;
            setTimeout(startGame, 1000); // Attendi prima di iniziare il nuovo livello
        } else {
            messageDisplay.innerText = `Sbagliato :C`;
            hideLevelSection(); // Nascondi la sezione dei livelli
            hideStartButton(); // Nascondi il bottone "Start Game"
            showReplayButton(); // Mostra il tasto "Rigioca"
            userSequence = [];
        }
    }
}

function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

function startGame() {
    messageDisplay.innerText = "Ascolta!";
    generateSequence(currentLevel);
    createButtons();
    userSequence = [];
    isUserTurn = false;
    startButton.style.display = "none"; // Nascondi il bottone "Start Game"
    scoreDisplay.style.display = "block"; // Mostra il punteggio
    replayButton.style.display = "none"; // Nascondi il tasto "Rigioca"

    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    sequence.forEach((sound, index) => {
        let oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(200 + sound * 100, audioContext.currentTime + index * 1); // Frequenze diverse per ogni suono
        oscillator.connect(audioContext.destination);
        oscillator.start(audioContext.currentTime + index);
        oscillator.stop(audioContext.currentTime + index + 0.5);
    });

    setTimeout(() => {
        messageDisplay.innerText = "Ora riproduci la sequenza cliccando sui pulsanti!";
        isUserTurn = true;
    }, sequence.length * 1000); // Aspetta che la sequenza venga riprodotta prima di dare il controllo all'utente
}

function hideStartButton() {
    startButton.style.display = "none"; // Nasconde il bottone "Start Game"
}

function showReplayButton() {
    replayButton.style.display = "block"; // Mostra il tasto "Rigioca"
}

function hideLevelSection() {
    buttonContainer.style.display = "none"; // Nasconde la sezione dei bottoni
}

function restartGame() {
    score = 0; // Reset del punteggio
    currentLevel = 1;
    messageDisplay.innerText = "Riprova :(";
    scoreDisplay.innerText = `Score: ${score}`; // Reset del punteggio visualizzato
    replayButton.style.display = "none"; // Nascondi il tasto "Rigioca"
    buttonContainer.style.display = "block"; // Mostra la sezione dei bottoni
    startButton.style.display = "block"; // Mostra di nuovo il tasto "Start Game"
    scoreDisplay.style.display = "none"; // Nascondi lo score
    startGame();
}
