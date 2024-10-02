import { useState, useRef, useEffect } from "react";

const Timeline = ({ startTime, endTime, duration, currentTime }) => {
  const [cursorPosition, setCursorPosition] = useState(currentTime);
  const timelineRef = useRef(null);

  // Update cursor position when currentTime changes
  useEffect(() => {
    setCursorPosition(currentTime);
  }, [currentTime]);

  const handleDrag = (e) => {
    const timelineWidth = timelineRef.current.offsetWidth;
    const timelineRect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - timelineRect.left; // Get the cursor's position relative to the timeline
    const newCursorPosition = Math.round((x / timelineWidth) * duration);

    // Ensure the cursor stays within the startTime and endTime
    if (newCursorPosition >= 0 && newCursorPosition <= duration) {
      setCursorPosition(newCursorPosition);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "50px",
        backgroundColor: "#f0f0f0",
      }}
      ref={timelineRef}
    >
      <div
        style={{
          position: "absolute",
          left: `0`,
          width: `${(duration / duration) * 100}%`,
          height: "100%",
          backgroundColor: "#007bff",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${(cursorPosition / duration) * 100}%`,
          width: "5px",
          height: "100%",
          backgroundColor: "red",
          cursor: "pointer",
          transform: "translateX(-50%)", // Center the cursor
        }}
        draggable
        onDrag={handleDrag}
      />
    </div>
  );
};

export default Timeline;
