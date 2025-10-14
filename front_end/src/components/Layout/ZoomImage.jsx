import React from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const ZoomImage = ({ src, alt, className = "", onError, fit = "contain" }) => {
  return (
    <Zoom
      zoomMargin={40}
      wrapElement="span"
      wrapStyle={{
        display: "inline-block",
        lineHeight: 0,
        width: "auto",
        height: "auto",
        maxWidth: "100%",
        maxHeight: "100%",
      }}
    >
      <img
        src={src}
        alt={alt || ""}
        onError={onError}
        className={className}
        style={{
          cursor: "zoom-in",
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: fit,
        }}
      />
    </Zoom>
  );
};

export default ZoomImage;
