import React from "react";
import { PlayerRef } from "@remotion/player";
import { useCurrentPlayerFrame } from "./use-current-player-frame";

export const TimeDisplay: React.FC<{
  playerRef: React.RefObject<PlayerRef>;
}> = ({ playerRef }) => {
  const frame = useCurrentPlayerFrame(playerRef);

  return <div>current frame: {frame}</div>;
};
