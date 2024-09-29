import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
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

  const getDurationInFrame = () => {
    setDurationInFrame((captions[captions?.length - 1]?.end / 1000) * fps);

    return (captions[captions?.length - 1]?.end / 1000) * fps;
  };

  const getCurrentCaptions = () => {
    const currentTime = (frame / 30) * 1000;
    const currentCaptions = captions.find(
      (item) => item.start <= currentTime && item.end >= currentTime
    );
    return currentCaptions ? currentCaptions.text : "";
  };

  return (
    <div>
      <AbsoluteFill style={{ backgroundColor: "black" }}>
        {imageList?.map((item, index) => (
          <>
            <Sequence
              key={index}
              from={(index * getDurationInFrame()) / imageList?.length}
              durationInFrames={getDurationInFrame()}
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
          </>
        ))}
        <Audio src={audioFileUrl} />
      </AbsoluteFill>
    </div>
  );
};

export default RemotionVideo;
