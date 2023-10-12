/* 
    Contributors: Jun Kim
    Class: IT 325
    Assignment: Hiit / Tabata
    Due Date: 10/11/2023
    Instructor: Dr. Reeves

    Javascript to handle user input, interactions, and displaying the time
*/

let timer;
let prepTime = 0; // user input for the length of preparation
let workoutTime = 0; // user input for the length of workout
let breakTime = 0; // user input for the length of breaks
let rounds = 0; // user input of the amount of rounds
let cycles = 0; // user input of the amount of cycles 
let currentRound = 0; // hold the current round, used to compare with the user input
let currentCycle = 0; // hold the current cycle, used to compare with the user input
let isPaused = true; // check if the start button is pressed
let currentPhase = 'Preparation'; // hold the phase of the workout. {preparation,workout,break}

// reference the start(pause) and reset buttons
const startPauseButton = document.getElementById('startPauseButton');
const resetButton = document.getElementById('resetButton');

startPauseButton.addEventListener('click', toggleStartPause);
resetButton.addEventListener('click', resetTimer);

// handle the start/pause so that the user can pause in the middle if needed
function toggleStartPause() {
  if (isPaused) {
    startTimer();
    startPauseButton.textContent = 'Pause';
  } 
  else {
    pauseTimer();
    startPauseButton.textContent = 'Resume';
  }
  isPaused = !isPaused;
}
 // initiate the tabata timer and check if the user entered the correct values
function startTimer() {
  prepTime = parseInt(document.getElementById('prepTime').value);
  workoutTime = parseInt(document.getElementById('workoutTime').value);
  breakTime = parseInt(document.getElementById('breakTime').value);
  rounds = parseInt(document.getElementById('numRounds').value);
  cycles = parseInt(document.getElementById('numCycles').value);

  currentRound = 1;
  currentCycle = 1;

  if (rounds <= 0 || workoutTime <= 0 || breakTime <= 0 || prepTime < 0 || prepTime > 30 || cycles <= 0) {
    if(prepTime > 30)
        alert(`You do not need to prepare longer than 30 seconds.`);
    else
        alert('Make sure that all the fields are entered.');

    return;
  }

  if (prepTime > 0) {
    displayTime(prepTime);
    currentPhase = 'Preparation';
    prepTime--;
  }

  // update the screen with the time every 1000 miliseconds  = 1sec
  timer = setInterval(updateTimer, 1000);
}

// update the timer accordingly
function updateTimer() {
    // decrease preparation time and don't let it be greater than 30
  if (prepTime > 0 && prepTime <= 30 && currentRound < rounds) {
    displayTime(prepTime);
    prepTime--;
    currentPhase = "Preparation";
  }
  // if there is still time for workout, decrease 1 sec and display that it is the workout phase
  else if (workoutTime > 0) {
    displayTime(workoutTime);
    workoutTime--;
    currentPhase = "Workout";
  } 
  // if there is still time for break, decrease 1 sec and display that it is the break phase
  else if (breakTime > 0) {
    displayTime(breakTime);
    breakTime--;
    currentPhase = "Break";
  }
  // when there is no time left for workout and break, calculate if a cycle has ended or if it just a round
  else {
    // if a rounds remain, reset the workout and break time back to the user input
    if (currentRound < rounds) {
      currentRound++;
      workoutTime = parseInt(document.getElementById('workoutTime').value);
      breakTime = parseInt(document.getElementById('breakTime').value);
    } 
    // if a cycle is done, reset round back to 1 and add to the cycle count
    else {
      currentRound = 1;
      currentCycle++;

      // if the cycle count is greater than the user input, end the workout
      if (currentCycle > cycles) {
        clearInterval(timer);
        startPauseButton.disabled = true;
        alert('Workout Completed.');
        return;
      }
      // if there is still a cycle left, reset the time bacak to user input for workout, break, and prepration 
      else {
        workoutTime = parseInt(document.getElementById('workoutTime').value);
        breakTime = parseInt(document.getElementById('breakTime').value);
        prepTime = parseInt(document.getElementById('prepTime').value);
      }
    }
  }
  displayRounds();
  displayCycles();
  displayPhase();
}

// display the time
function displayTime(time) {
  const minutes = Math.floor(time / 60); // divide seconds by 60 to get minutes and round down to get minutes
  const seconds = (time % 60); // remainder of the seconds will be in the seconds part of the time
  const display = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // add a leading zero to min/sec if it is a single digit
  
  document.getElementById('timer-display').textContent = display; // display the time after calculation
}

function displayRounds() {
  document.getElementById('rounds-display').textContent = `Rounds left: ${rounds - currentRound + 1}`;
}

function displayCycles() {
  document.getElementById('cycles-display').textContent = `Cycles left: ${cycles - currentCycle + 1}`;
}

function displayPhase() {
  document.getElementById('phase-display').textContent = `${currentPhase}`;
}

// stop counting down when user clicks pause button
function pauseTimer() {
  clearInterval(timer);
}

// clear all fields to default value whe user clicks reset button
function resetTimer() {
  clearInterval(timer);
  isPaused = true;
  startPauseButton.textContent = 'Start';
  document.getElementById('timer-display').textContent = '00:00';
  document.getElementById('rounds-display').textContent = 'Rounds left: 0';
  document.getElementById('cycles-display').textContent = 'Cycles left: 0';
  document.getElementById('prepTime').value = '';
  document.getElementById('workoutTime').value = '';
  document.getElementById('breakTime').value = '';
  document.getElementById('numRounds').value = '';
  document.getElementById('numCycles').value = '';
  startPauseButton.disabled = false;
  currentPhase = "Preparation";
  displayPhase();
}

// variables to handle music
const playButton = document.getElementById('playButton');
const audio = document.getElementById('audioPlayer');

audio.loop = true; // keep looping the audio

playButton.addEventListener('click', function() {
  if (audio.paused) {
    audio.play();
    playButton.innerHTML = 'OFF';
  } 
  else {
    audio.pause();
    playButton.innerHTML = 'ON';
  }
});