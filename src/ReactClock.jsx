import React, { useState, useRef } from 'react'


function ReactClock() {

    const [state, setState] = useState({
        breakLength: 5,
        sessionLength: 25,
        breakTime: 300, // 5 minutes en secondes
        time: 1500, // 25 minutes en secondes
        display: "25:00",
        isRunning: false,
        isSessionTime: true,
        isBreakTime: false,
    }
  );

  const timerInterval = useRef(null);

    

    const formatTime = (num) => {
      return num < 10 ? "0" + num : num.toString();
    }
  
    const decrement = (type) => {
      setState(prev => {
        const newSessionLength = prev[type] > 1 ? prev[type] - 1 : 1;
        const updates = {
          [type]: newSessionLength,
        };

        if (type === "sessionLength") {
          updates.time = newSessionLength * 60; //Cnversion en secondes
          updates.display = formatTime(newSessionLength) + ":00";
        }

        if (type === "breakLength") {
          updates.breakTime = newSessionLength * 60;
        }

        return updates;
      })
    }
  
 const increment = (type) => {
  setState(prev => {
    const newSessionLength = prev[type] < 60 ? prev[type] + 1 : 60;
    const updates = {
      [type]: newSessionLength,
    };

    if (type === "sessionLength") {
      updates.time = newSessionLength * 60;
      updates.display = formatTime(newSessionLength) + ":00";
    }

    if (type === "breakLength") {
      updates.breakTime = newSessionLength * 60;
    }

    return updates;
  })
 }
  
  const reset = () => {
    clearInterval(timerInterval.current); //Arrête le timer en cours
    setState({
      breakLength: 5,
        sessionLength: 25,
        breakTime: 300, // 5 minutes en secondes
        time: 1500, // 25 minutes en secondes
        display: "25:00",
        isRunning: false,
        isSessionTime: true,
        isBreakTime: false,
    });
    playSound(false); //Arrête le on si le timer se finit
  }
  
const startStop = () => {
  if(state.isRunning) {
    clearInterval(timerInterval.current);
    setState(prev => ({
      ...prev,
      isRunning: false
    }));
  } else {
    timerInterval.current = setInterval(handleInterval, 1000);
    setState(prev => ({
      ...prev,
      isRunning: true
    }));
  }
}
  
const handleInterval = () => {
  setState(prev => {
    let { time, breakTime, isSessionTime, isBreakTime, sessionLength, breakLength } = prev;

    if (isSessionTime) {
      if (time > 0) {
        time -= 1;
      } else {
        playSound(true);
        isSessionTime = false;
        isBreakTime = true;
        breakTime = breakLength * 60;
      }
    } else if (isBreakTime) {
      if(breakTime > 0) {
        breakTime -= 1;
      } else {
        playSound(true);
        isSessionTime = true;
        isBreakTime = false;
        time = sessionLength * 60;
      }
    }
    
    const currentTime = isSessionTime ? time : breakTime;
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;

    return {
      ...prev,
      time,
      breakTime,
      isSessionTime,
      isBreakTime,
      display: formatTime(minutes) + ":" + formatTime(seconds),
    }

  })
}

const playSound = (play) => {
  const beep = document.getElementById("beep");

  if (play) {
    beep.play(); // joue le son
  } else {
    beep.pause(); // stop le son
    beep.currentTime = 0; //remet le son à 0 
  }
}
  
    
      return (
        <div>
          <div id="container">
          <div id="break-container">
          <div id="break-label">Break Length</div>
          <button id="break-decrement" onClick={() => decrement("breakLength")}>-</button>
          <button id="break-increment" onClick={() => increment("breakLength")}>+</button>
          <div id="break-length">{state.breakLength}</div>
          </div>
          
  
          <div id="session-container">
          <div id="session-label">Session Length</div>
          <button id="session-decrement" onClick={() => decrement("sessionLength")}>-</button>
          <button id="session-increment" onClick={() => increment("sessionLength")}>+</button>
          <div id="session-length">{state.sessionLength}</div>
          </div>
  
          <div id="timer-container">
          <div id="timer-label">{state.isSessionTime ? "Session" : "Break"}</div>
          <div id="time-left">{state.display}</div>
          <audio id="beep" src="https://github.com/liiam-html/allSRC/raw/refs/heads/main/audio/beep_alarm.wav"></audio>
          <button id="start_stop" onClick={startStop}>{state.isRunning ? "Pause" : "Start"}</button>
          <button id="reset" onClick={reset}>reset</button>
        </div>
          </div>
          </div>
      );
    
  }
  
export default ReactClock;

  
  
