import { useEffect, useState } from "react";
import { AbsoluteFill, OffthreadVideo, useVideoConfig } from "remotion";

export const MyComposition = ({
  setTimelineWidth,
  setVideoDuration,
  currentTimeInSeconds,
  setTotalFrames,
}) => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const { durationInFrames, fps, width, height } = useVideoConfig();

  useEffect(() => {
    const durationInSeconds = durationInFrames / fps;
    console.log("durationInFrames", durationInFrames);
    setVideoDuration(durationInSeconds);
    setTotalFrames(durationInFrames);
  }, [durationInFrames, fps, setVideoDuration, setTotalFrames]);

  useEffect(() => {
    const fetchVideo = async () => {
      const response = await fetch(
        "https://res.cloudinary.com/dgbjpy7ev/video/upload/v1688732770/samples/sea-turtle.mp4"
      );
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setObjectUrl(url);
      const videoElement = document.createElement("video");
      videoElement.src = url;
      videoElement.preload = "metadata";

      videoElement.addEventListener("loadedmetadata", (data) => {
        console.log(data.currentTarget);
        const videoDurationInSeconds = videoElement.duration;
        console.log("Video Duration in seconds:", videoDurationInSeconds); // Log the duration
        const videoDurationInMilliseconds = videoDurationInSeconds * 1000;
        setVideoDuration(videoDurationInMilliseconds);
        setTimelineWidth(videoDurationInMilliseconds);
      });

      return () => {
        URL.revokeObjectURL(url);
        videoElement.src = "";
      };
    };

    fetchVideo();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  useEffect(() => {
    if (objectUrl) {
      // Update video playback position when currentTime changes
      const videoElement = document.querySelector("video");
      if (videoElement) {
        videoElement.currentTime = currentTimeInSeconds;
      }
    }
  }, [currentTimeInSeconds, objectUrl]);

  if (!objectUrl) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <AbsoluteFill>
        <OffthreadVideo src={objectUrl} />
      </AbsoluteFill>
    </>
  );
};
