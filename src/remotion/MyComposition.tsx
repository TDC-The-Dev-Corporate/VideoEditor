import { useEffect, useState } from "react";
import { AbsoluteFill, OffthreadVideo, useVideoConfig } from "remotion";

export const MyComposition = ({
  setTimelineWidth,
  setVideoDuration,
  currentTimeInSeconds,
  setTotalFrames,
}: {
  setTimelineWidth: (width: number) => void;
  setVideoDuration: (duration: number) => void;
  currentTimeInSeconds: number;
  setTotalFrames: (totalFrames: number) => void;
}) => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const { durationInFrames, fps } = useVideoConfig();

  useEffect(() => {
    const durationInSeconds = durationInFrames / fps;
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

      videoElement.addEventListener("loadedmetadata", () => {
        const videoDurationInSeconds = videoElement.duration;
        setVideoDuration(videoDurationInSeconds * 1000);
        setTimelineWidth(videoDurationInSeconds * 1000);
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
