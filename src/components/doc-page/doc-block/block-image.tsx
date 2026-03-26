import { BlockImage } from "@/types/document";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  CloseButton,
  CropButtons,
  CropUIOverlay,
  PopoverMenu,
  ResizeButton,
} from "./block-image/index";

interface BlockImageItemProps {
  image: BlockImage;
  onUpdate: (image: BlockImage) => void;
  onDelete: (imageId: string) => void;
}

type Mode = "view" | "resize" | "crop";

const LANDSCAPE_RATIOS = [
  { label: "16:9", value: 16 / 9 },
  { label: "3:2", value: 3 / 2 },
  { label: "4:3", value: 4 / 3 },
  { label: "1:1", value: 1 },
  { label: "Livre", value: 0 },
];

const PORTRAIT_RATIOS = [
  { label: "9:16", value: 9 / 16 },
  { label: "2:3", value: 2 / 3 },
  { label: "3:4", value: 3 / 4 },
  { label: "1:1", value: 1 },
  { label: "Livre", value: 0 },
];

export const BlockImageItem: React.FC<BlockImageItemProps> = ({
  image,
  onUpdate,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("view");
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Live editing state (preview during drag, committed on mouseup)
  const [liveWidthPx, setLiveWidthPx] = useState<number | null>(null);
  const [liveCrop, setLiveCrop] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const widthPx = liveWidthPx ?? image.edits.resize?.widthPx ?? 220;
  const crop = useMemo(
    () => liveCrop ?? image.edits.crop ?? { x: 0, y: 0, width: 100, height: 100 },
    [liveCrop, image.edits.crop]
  );
  const hasCropInfo = !!image.edits.crop;
  const isLandscape = naturalSize.width >= naturalSize.height;

  const handleImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    },
    [],
  );

  /* ─── wrapper + img styles ─── */

  const getWrapperStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {
      width: `${widthPx}px`,
      maxWidth: "100%",
      position: "relative",
      overflow: mode === "crop" ? "hidden" : "hidden",
      borderRadius: "0.375rem",
      border:
        mode !== "view"
          ? "2px solid var(--primary)"
          : "1px solid var(--border)",
    };

    if (naturalSize.width > 0) {
      if (mode === "crop") {
        // Show the full physical image proportions during crop
        style.aspectRatio = `${naturalSize.width} / ${naturalSize.height}`;
      } else if (hasCropInfo) {
        // Show cropped proportions
        const cropW = (crop.width / 100) * naturalSize.width;
        const cropH = (crop.height / 100) * naturalSize.height;
        style.aspectRatio = `${cropW} / ${cropH}`;
      }
    }
    return style;
  };

  const getImageStyle = (): React.CSSProperties => {
    // In crop mode, the image fills the wrapper completely (showing its full uncropped self)
    if (mode === "crop" || !hasCropInfo) {
      return {
        width: "100%",
        height: "100%",
        display: "block",
        objectFit: "contain",
      };
    }
    // In view or resize mode with crop, scale image so the cropped area fills the wrapper
    return {
      position: "absolute",
      width: `${(100 / crop.width) * 100}%`,
      height: `${(100 / crop.height) * 100}%`,
      left: `${-(crop.x / crop.width) * 100}%`,
      top: `${-(crop.y / crop.height) * 100}%`,
      maxWidth: "none",
    };
  };

  /* ─── RESIZE drag ─── */

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX;
      const startY = e.clientY;
      const startW = widthPx;
      const wrapper = wrapperRef.current;
      const parent = wrapper?.parentElement;
      if (!parent || !wrapper) return;

      const parentW = parent.clientWidth;
      const rect = wrapper.getBoundingClientRect();
      const aspectRatio = rect.width / rect.height;

      const onMove = (ev: MouseEvent) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;

        const deltaFromY = dy * aspectRatio;
        const delta = Math.abs(dx) > Math.abs(deltaFromY) ? dx : deltaFromY;

        // Ensure within bounds (min 50px, max parent width)
        setLiveWidthPx(Math.max(50, Math.min(parentW, startW + delta)));
      };

      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        setLiveWidthPx((cur) => {
          const final = Math.round(cur ?? startW);
          onUpdate({
            ...image,
            edits: { ...image.edits, resize: { widthPx: final } },
          });
          return null;
        });
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [widthPx, image, onUpdate],
  );

  /* ─── CROP drag ─── */

  const handleCropStart = useCallback(
    (direction: "x" | "y" | "xy") => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX;
      const startY = e.clientY;
      const startCrop = crop;
      const wrapper = wrapperRef.current;
      if (!wrapper || naturalSize.width === 0) return;

      const rect = wrapper.getBoundingClientRect();

      const onMove = (ev: MouseEvent) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;

        const nc = { ...startCrop };

        if (direction === "x" || direction === "xy") {
          const dW = (dx / rect.width) * 100;
          nc.width = Math.max(5, Math.min(100 - nc.x, startCrop.width + dW));
        }

        if (direction === "y" || direction === "xy") {
          const dH = (dy / rect.height) * 100;
          nc.height = Math.max(5, Math.min(100 - nc.y, startCrop.height + dH));
        }

        setLiveCrop(nc);
      };

      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        // During crop mode drag, we just update local state.
        // It only gets saved when clicking "Recortar".
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [crop, naturalSize],
  );

  /* ─── aspect-ratio presets ─── */

  const applyAspectRatio = useCallback(
    (ratio: number) => {
      if (naturalSize.width === 0) return;
      if (ratio === 0) {
        setLiveCrop({ x: 0, y: 0, width: 100, height: 100 });
        return;
      }

      const cur = crop;
      let newH = (cur.width * naturalSize.width) / (ratio * naturalSize.height);
      let newW = cur.width;

      if (cur.y + newH > 100) {
        newH = 100 - cur.y;
        newW = (newH * ratio * naturalSize.height) / naturalSize.width;
      }

      setLiveCrop({ x: cur.x, y: cur.y, width: newW, height: newH });
    },
    [crop, naturalSize],
  );

  const commitCrop = () => {
    onUpdate({
      ...image,
      edits: {
        ...image.edits,
        crop: crop,
      },
    });
    setMode("view");
    setLiveCrop(null);
  };

  const cancelCrop = () => {
    setMode("view");
    setLiveCrop(null);
  };

  const ratios = isLandscape ? LANDSCAPE_RATIOS : PORTRAIT_RATIOS;

  /* ─── Handle classes ─── */
  const handleBase =
    "absolute z-30 flex items-center justify-center bg-primary shadow-md hover:scale-110 active:scale-95 transition-transform";

  return (
    <div
      className="my-2 pl-9.5 pr-4 flex flex-col items-start gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      {/* ── Crop: aspect-ratio bar ── */}
      {mode === "crop" && (
        <div className="flex items-center gap-1.5 p-1 rounded-md bg-muted/50 border border-border">
          {ratios.map((r) => (
            <button
              key={r.label}
              onClick={() => applyAspectRatio(r.value)}
              className="text-[11px] px-2.5 py-1 rounded bg-background hover:bg-muted-foreground/10 text-foreground transition-colors font-medium border border-border/50 shadow-sm"
            >
              {r.label}
            </button>
          ))}
        </div>
      )}

      <div
        ref={wrapperRef}
        className="relative group inline-block"
        style={getWrapperStyle()}
      >
        <img
          src={image.src}
          alt={image.alt || ""}
          onLoad={handleImageLoad}
          style={getImageStyle()}
          draggable={false}
          className="select-none pointer-events-none"
        />

        {/* ── View: popover menu ── */}
        {mode === "view" && (
          <PopoverMenu
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            setMode={setMode}
            onDelete={() => onDelete(image.id)}
          />
        )}

        {/* ── Close button (resize mode) ── */}
        {mode === "resize" && <CloseButton setMode={setMode} />}

        {/* ── Resize handle (bottom-right) ── */}
        {mode === "resize" && (
          <ResizeButton
            onMouseDown={handleResizeStart}
            handleBase={handleBase}
          />
        )}

        {/* ── Crop UI Overlay ── */}
        {mode === "crop" && (
          <CropUIOverlay
            crop={crop}
            handleCropStart={handleCropStart}
            handleBase={handleBase}
          />
        )}
      </div>

      {/* ── Crop Buttons (Below Image) ── */}
      {mode === "crop" && (
        <CropButtons commitCrop={commitCrop} cancelCrop={cancelCrop} />
      )}
    </div>
  );
};
