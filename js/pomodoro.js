class ReactClock extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        break: 5,
        session: 25,
        breakTime: 300, // 5 minutes en secondes
        time: 1500, // 25 minutes en secondes
        display: "25:00",
        isRunning: false,
        isSessionTime: true,
        isBreakTime: false,
      };
      
      this.timerInterval = null;
  
      this.decrement = this.decrement.bind(this);
      this.increment = this.increment.bind(this);
      this.reset = this.reset.bind(this);
      this.startStop = this.startStop.bind(this);
      this.interval = this.interval.bind(this);
      this.playSound = this.playSound.bind(this);
    }
  
    formatTime(num) {
      return num < 10 ? "0" + num : num.toString();
    }
  
    decrement(type) {
      this.setState((state) => {
        const newSessionLength = state[type] > 1 ? state[type] - 1 : 1;
        const updates = {
          [type]: newSessionLength,
        };
  
        if (type === "session") {
          updates.time = newSessionLength * 60; // Conversion en secondes
          updates.display = this.formatTime(newSessionLength) + ":00";
        }
        if (type === "break") {
          updates.breakTime = newSessionLength * 60; // Conversion en secondes
        }
  
        return updates;
      });
    }
  
    increment(type) {
      this.setState((state) => {
        const newSessionLength = state[type] < 60 ? state[type] + 1 : 60;
        const updates = {
          [type]: newSessionLength,
        };
  
        if (type === "session") {
          updates.time = newSessionLength * 60; // Conversion en secondes
          updates.display = this.formatTime(newSessionLength) + ":00";
        }
  
        if (type === "break") {
          updates.breakTime = newSessionLength * 60; // Conversion en secondes
        }
  
        return updates;
      });
    }
  
    reset() {
      this.setState({
        break: 5,
        session: 25,
        breakTime: 300, // 5 minutes en secondes
        time: 1500, // 25 minutes en secondes
        display: "25:00",
        isRunning: false,
        isSessionTime: true,
        isBreakTime: false,
      });
      clearInterval(this.timerInterval); // Arrête le timer en cours
      this.playSound(false); // Arrêter le son si le timer était en fin
    }
  
   startStop() {
  if (this.state.isRunning) {
    clearInterval(this.timerInterval);
    this.setState({ isRunning: false });
  } else {
    this.timerInterval = setInterval(this.interval, 1000);
    this.setState({ isRunning: true });
  }
}
  
interval() {
  this.setState((prevState) => {
    let { time, breakTime, isSessionTime, isBreakTime, session, break: breakLen } = prevState;

    if (isSessionTime) {
      if (time > 0) {
        time -= 1;
      } else {
        this.playSound(true);
        isSessionTime = false;
        isBreakTime = true;
        breakTime = breakLen * 60;
      }
    } else if (isBreakTime) {
      if (breakTime > 0) {
        breakTime -= 1;
      } else {
        this.playSound(true);
        isSessionTime = true;
        isBreakTime = false;
        time = session * 60;
      }
    }

    const currentTime = isSessionTime ? time : breakTime;
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;

    return {
      time,
      breakTime,
      isSessionTime,
      isBreakTime,
      display: this.formatTime(minutes) + ":" + this.formatTime(seconds),
    };
  });
}
  
    playSound(play) {
      const beep = document.getElementById("beep");
      if (play) {
        beep.play(); // Joue le son
      } else {
        beep.pause(); // Arrête le son
        beep.currentTime = 0; // Remet le son à 0 (pour jouer à nouveau à partir du début)
      }
    }
  
    render() {
      return (
        <div>
          <div id="container">
          <div id="break-container">
          <div id="break-label">Break Length</div>
          <button id="break-decrement" onClick={() => this.decrement("break")}>-</button>
          <button id="break-increment" onClick={() => this.increment("break")}>+</button>
          <div id="break-length">{this.state.break}</div>
          </div>
          
  
          <div id="session-container">
          <div id="session-label">Session Length</div>
          <button id="session-decrement" onClick={() => this.decrement("session")}>-</button>
          <button id="session-increment" onClick={() => this.increment("session")}>+</button>
          <div id="session-length">{this.state.session}</div>
          </div>
  
          <div id="timer-container">
          <div id="timer-label">{this.state.isSessionTime ? "Session" : "Break"}</div>
          <div id="time-left">{this.state.display}</div>
          <audio id="beep" src="https://github.com/liiam-html/allSRC/raw/refs/heads/main/audio/beep_alarm.wav"></audio>
          <button id="start_stop" onClick={this.startStop}>{this.state.isRunning ? "Pause" : "Start"}</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
          </div>
          </div>
      );
    }
  }
  
  ReactDOM.render(<ReactClock />, document.getElementById("app"));
