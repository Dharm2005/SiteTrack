import React from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const ZoomImage = ({ src, alt, className = "", onError, fit = "contain" }) => {
  return (
    <Zoom
      zoomMargin={40}
      // Add these props to control the wrapper styling
      wrapElement="div"
      wrapStyle={{
        width: "100%",
        height: "100%",
        display: "block"
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