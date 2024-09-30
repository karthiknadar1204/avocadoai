import React, { useEffect } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

const RemotionVideo = ({
  script,
  audioFileUrl,
  captions,
  imageList,
  setDurationInFrame,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  useEffect(() => {
    if (captions && captions.length > 0) {
      const duration = (captions[captions.length - 1].end / 1000) * fps;
      setDurationInFrame(duration);
    }
  }, [captions, fps, setDurationInFrame]);

  const getDurationInFrame = () => {
    return captions && captions.length > 0
      ? (captions[captions.length - 1].end / 1000) * fps
      : 0;
  };

  const getCurrentCaptions = () => {
    const currentTime = (frame / fps) * 1000;
    const currentCaptions = captions?.find(
      (item) => item.start <= currentTime && item.end >= currentTime
    );
    return currentCaptions ? currentCaptions.text : "";
  };

  return (
    <div>
      <AbsoluteFill style={{ backgroundColor: "black" }}>
        {imageList?.map((item, index) => {
          const startTime = (index * getDurationInFrame()) / imageList.length;
          const duration = getDurationInFrame() / imageList.length;

          const scale = interpolate(
            frame,
            [startTime, startTime + duration / 2, startTime + duration],
            index % 2 === 0 ? [1, 1.8, 1] : [1.8, 1, 1.8],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.45, 0.05, 0.55, 0.95),
            }
          );

          const opacity = interpolate(
            frame,
            [startTime, startTime + duration * 0.1, startTime + duration * 0.9, startTime + duration],
            [0, 1, 1, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }
          );

          return (
            <Sequence
              key={index}
              from={startTime}
              durationInFrames={duration}
            >
              <AbsoluteFill
                style={{ justifyContent: "center", alignItems: "center" }}
              >
                <Img
                  src={item}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: `scale(${scale})`,
                    opacity: opacity,
                  }}
                />
                <AbsoluteFill
                  style={{
                    color: "white",
                    justifyContent: "center",
                    alignItems: "center",
                    top: "undefined",
                    bottom: 50,
                    height: 150,
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  <h2 className="text-2xl font-bold">{getCurrentCaptions()}</h2>
                </AbsoluteFill>
              </AbsoluteFill>
            </Sequence>
          );
        })}
        {audioFileUrl && <Audio src={audioFileUrl} />}
      </AbsoluteFill>
    </div>
  );
};

export default RemotionVideo;
