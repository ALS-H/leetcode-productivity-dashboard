import React, { useState, useEffect, useRef } from "react";
import "../styles/Clock.css";
import { useAuth } from "../context/AuthContext"; // ✅ import context

const API = import.meta.env.VITE_API_BASE_URL;

function Clock() {
  const { user, token } = useAuth(); // ✅ access user + token from context

  const [isPomodoro, setIsPomodoro] = useState(false);
  const [time, setTime] = useState(new Date());

  const FOCUS_MINUTES = 25;
  const BREAK_MINUTES = 5;

  const [isFocusPhase, setIsFocusPhase] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [totalTime, setTotalTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const timerInterval = useRef(null);
  const focusStartTime = useRef(null);

  const fetchTotalStudyTime = async () => {
    try {
      const res = await fetch(`${API}/api/sessions/total`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTotalTime(data);
    } catch (err) {
      console.error("❌ Failed to fetch total study time:", err);
    }
  };

  useEffect(() => {
    const clockInterval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    if (token && user) {
      fetchTotalStudyTime();
    }
  }, [token,user]);

  useEffect(() => {
    if (isRunning) {
      timerInterval.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval.current);
            setIsRunning(false);

            if (isFocusPhase) {
              const durationInSeconds = Math.floor((Date.now() - focusStartTime.current) / 1000);
              fetch(`${API}/api/sessions/complete/${sessionId}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ duration: durationInSeconds }),
              })
                .then(() => fetchTotalStudyTime())
                .catch((err) => console.error("❌ Failed to complete session:", err));

              setTimeout(() => {
                setIsFocusPhase(false);
                setSecondsLeft(BREAK_MINUTES * 60);
                setIsRunning(true);
              }, 1000);
            } else {
              setTimeout(() => {
                setSessionId(null);
                startPomodoro();
              }, 1000);
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerInterval.current);
    }

    return () => clearInterval(timerInterval.current);
  }, [isRunning, sessionId, isFocusPhase]);

  const formatTime = (secs) => {
    const minutes = String(Math.floor(secs / 60)).padStart(2, "0");
    const seconds = String(secs % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const toggleMode = () => setIsPomodoro((prev) => !prev);

  const startPomodoro = async () => {
    if (!token || !user) return;

    if (!sessionId) {
      setIsFocusPhase(true);
      setSecondsLeft(FOCUS_MINUTES * 60);

      try {
        const res = await fetch(`${API}/api/sessions/start`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        });
        const data = await res.json();
        setSessionId(data._id);
        focusStartTime.current = Date.now();
        setIsRunning(true);
      } catch (err) {
        console.error("❌ Failed to start session", err);
      }
    } else {
      focusStartTime.current = Date.now();
      setIsRunning(true);
    }
  };

  const handleStartPause = (e) => {
    e.stopPropagation();
    if (!token || !user) return;

    if (!isRunning) {
      if (isFocusPhase && !sessionId) {
        startPomodoro();
      } else {
        focusStartTime.current = Date.now();
        setIsRunning(true);
      }
    } else {
      setIsRunning(false);
    }
  };

  const handleReset = (e) => {
    e.stopPropagation();
    setIsRunning(false);
    setIsFocusPhase(true);
    setSessionId(null);
    setSecondsLeft(FOCUS_MINUTES * 60);
  };

  if (!user || !token) {
    return (
      <div className="clock-card">
        <h2>Pomodoro Timer</h2>
        <p>Please log in to track your sessions.</p>
      </div>
    );
  }

  return (
    <div className="clock-card" onClick={toggleMode}>
      {isPomodoro ? (
        <>
          <h2 className="clock-title">{isFocusPhase ? "Focus Session" : "Break Time"}</h2>
          <p className="clock-time">{formatTime(secondsLeft)}</p>
          <div className="timer-controls">
            <button onClick={handleStartPause}>{isRunning ? "Pause" : "Start"}</button>
            <button onClick={handleReset}>Reset</button>
          </div>
          <p className="tip">(Click anywhere to switch to Clock)</p>
        </>
      ) : (
        <>
          <h2 className="clock-title">Clock</h2>
          <p className="clock-time">{time.toLocaleTimeString()}</p>
          <p style={{ fontWeight: "600", marginTop: "1rem" }}>
            Pomodoro Timer: {formatTime(secondsLeft)} {isRunning ? "(Running)" : "(Paused)"} [{isFocusPhase ? "Focus" : "Break"}]
          </p>
          <p style={{ fontWeight: "600", marginTop: "1rem" }}>
            Total Study Time Today: {totalTime.hours}h {totalTime.minutes}m {totalTime.seconds}s
          </p>
          <p className="tip">(Click anywhere to switch to Pomodoro)</p>
        </>
      )}
    </div>
  );
}

export default Clock;
