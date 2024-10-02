import "./App.css";
import { Player, RenderLoading, PlayerRef } from "@remotion/player";
import { MyComposition } from "./remotion/MyComposition";
import { useCallback, useState, useRef, useEffect } from "react";
import { AbsoluteFill } from "remotion";
import { TimeDisplay } from "./remotion/TimeDisplay";

function App() {
  const [timelineWidth, setTimelineWidth] = useState<number>(1);
  const [totalFrames, setTotalFrames] = useState<number>(1);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number | undefined>(undefined);
  const [isDraggingStart, setIsDraggingStart] = useState<boolean>(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const playerRef = useRef<PlayerRef>(null);
  console.log(timelineWidth);
  const renderLoading: RenderLoading = useCallback(({ height, width }) => {
    return (
      <AbsoluteFill style={{ backgroundColor: "gray" }}>
        Loading player ({height}x{width})
      </AbsoluteFill>
    );
  }, []);

  // Update timeline width based on start and end time
  useEffect(() => {
    const newWidth = Math.max(endTime - startTime, 1); // Ensure width is at least 1
    setTimelineWidth(newWidth);
  }, [startTime, endTime]);

  // Update video duration and end time when video duration changes
  useEffect(() => {
    setEndTime(videoDuration); // Reset end time when video duration changes
    setCurrentTime(videoDuration); // Set current time to video duration
  }, [videoDuration]);

  const handleMouseDownStart = () => {
    setIsDraggingStart(true);
  };

  const handleMouseDownEnd = () => {
    setIsDraggingEnd(true);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    // Prevent seeking on handle drag
    if (isDraggingStart || isDraggingEnd) {
      const timeline = event.currentTarget;
      const rect = timeline.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const newTime = (offsetX / rect.width) * videoDuration;

      if (isDraggingStart) {
        setStartTime(Math.min(newTime, endTime)); // Ensure start time does not exceed end time
      } else if (isDraggingEnd) {
        setEndTime(Math.max(newTime, startTime)); // Ensure end time does not go below start time
      }
    }
  };

  const handleMouseUp = () => {
    setIsDraggingStart(false);
    setIsDraggingEnd(false);
  };

  // Function to set the current time of the player
  const setPlayerCurrentTime = (timeInSeconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(timeInSeconds);
    }
  };

  // Update the current time based on start and end time whenever the user interacts
  useEffect(() => {
    if (currentTime !== undefined) {
      const newCurrentTime = Math.min(
        Math.max(currentTime, startTime / 1000),
        endTime / 1000
      ); // Keep current time within start and end time
      setPlayerCurrentTime(newCurrentTime);
    }
  }, [startTime, endTime, currentTime]);

  // Update video playback position when currentTime changes
  useEffect(() => {
    if (currentTime !== undefined) {
      setPlayerCurrentTime(currentTime); // Update player current time when currentTime changes
    }
  }, [currentTime]);

  // Update currentTime state when the user clicks on the timeline
  const handleClickTimeline = (event: React.MouseEvent<HTMLDivElement>) => {
    const timeline = event.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const newTime = (offsetX / rect.width) * videoDuration;

    playerRef?.current?.pause();
    setCurrentTime(newTime); // Update the currentTime state to reflect the new time
  };

  return (
    <>
      <Player
        ref={playerRef}
        component={MyComposition}
        inputProps={{
          setTimelineWidth,
          setVideoDuration,
          currentTimeInSeconds: currentTime,
          setTotalFrames,
        }}
        renderLoading={renderLoading}
        durationInFrames={totalFrames} // Use trimmed duration
        compositionWidth={1920}
        compositionHeight={1080}
        controls
        fps={30}
        style={{
          // widows
          height: "100%",
        }}
        spaceKeyToPlayOrPause
        loop
        autoPlay
        allowFullscreen
        showPlaybackRateControl
        showVolumeControls
        doubleClickToFullscreen
        hideControlsWhenPointerDoesntMove
      />
      <TimeDisplay playerRef={playerRef} />

      <div>
        {/* Timeline */}
        <div className="mt-12 bg-neutral-700 rounded-lg overflow-hidden p-4 h-full w-full">
          <div
            className="w-full h-8 relative"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleClickTimeline} // Handle clicks on the timeline
            style={{
              cursor: isDraggingStart || isDraggingEnd ? "pointer" : "auto",
            }}
          >
            <div
              className="absolute bg-black h-full"
              style={{
                width: `${((endTime - startTime) / videoDuration) * 100}%`, // Width based on trimmed duration
                left: `${(startTime / videoDuration) * 100}%`, // Position the timeline section
              }}
            />
            {/* Start Handle */}
            <div
              className="absolute bg-red-500 h-full w-1"
              style={{
                left: `${(startTime / videoDuration) * 100}%`,
                transform: "translateX(-50%)",
              }}
              onMouseDown={handleMouseDownStart}
            />

            {/* End Handle */}
            <div
              className="absolute bg-red-500 h-full w-1"
              style={{
                left: `${(endTime / videoDuration) * 100}%`,
                transform: "translateX(-50%)",
              }}
              onMouseDown={handleMouseDownEnd}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span>{(startTime / 1000).toFixed(2)} s</span> {/* Start Time */}
            <span>{(endTime / 1000).toFixed(2)} s</span> {/* End Time */}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
