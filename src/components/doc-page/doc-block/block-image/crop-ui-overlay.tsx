import React from "react";

interface CropUIOverlayProps {
  crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  handleCropStart: (direction: "x" | "y" | "xy") => (e: React.MouseEvent) => void;
  handleBase: string;
}

export const CropUIOverlay: React.FC<CropUIOverlayProps> = ({ crop, handleCropStart, handleBase }) => {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden ">
      {/* The bright crop area with a massive dark box-shadow casting the dim background */}
      <div
        className="absolute pointer-events-auto border"
        style={{
          left: `${crop.x}%`,
          top: `${crop.y}%`,
          width: `${crop.width}%`,
          height: `${crop.height}%`,
          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.6)",
        }}
      >
        {/* Crop handles inside the bright area */}
        {/* Right — crop X */}
        <div
          onMouseDown={handleCropStart("x")}
          className={`${handleBase} top-1/2 -right-1.5 -translate-y-1/2 w-3 h-10 cursor-ew-resize rounded-md`}
          title="Cortar horizontalmente"
        >
          <div className="w-0.5 h-4 bg-primary-foreground rounded-full" />
        </div>

        {/* Bottom — crop Y */}
        <div
          onMouseDown={handleCropStart("y")}
          className={`${handleBase} -bottom-1.5 left-1/2 -translate-x-1/2 h-3 w-10 cursor-ns-resize rounded-md`}
          title="Cortar verticalmente"
        >
          <div className="h-0.5 w-4 bg-primary-foreground rounded-full" />
        </div>

        {/* Bottom-right — crop XY */}
        <div
          onMouseDown={handleCropStart("xy")}
          className={`${handleBase} -bottom-1.5 -right-1.5 w-4 h-4 cursor-nwse-resize rounded-full`}
          title="Cortar em ambas direções"
        >
          <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full" />
        </div>
      </div>
    </div>
  );
};
