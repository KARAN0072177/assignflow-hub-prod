import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  Check,
  X,
  Move,
  Crop,
} from "lucide-react";

interface AvatarCropperModalProps {
  imageSrc: string;
  fileName?: string;
  onCrop: (croppedFile: File) => void;
  onClose: () => void;
}

const VIEWPORT_SIZE = 320; // Displayed crop window container size (px)
const CROP_SIZE = 260; // Active crop circle diameter (px)
const OUTPUT_SIZE = 512; // Exported square avatar resolution (px)

export const AvatarCropperModal: React.FC<AvatarCropperModalProps> = ({
  imageSrc,
  fileName = "avatar.jpg",
  onCrop,
  onClose,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });

  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Initialize image and compute proportional base dimensions for the active crop circle
  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      imageRef.current = img;
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;

      // Base scale ensures image completely covers the CROP_SIZE circle at zoom=1 maintaining aspect ratio
      const baseScale = Math.max(CROP_SIZE / nw, CROP_SIZE / nh);
      setImgDimensions({
        width: nw * baseScale,
        height: nh * baseScale,
      });

      setImageLoaded(true);
      setPosition({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    };
  }, [imageSrc]);

  // Handle Mouse Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle Touch Dragging
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Handle Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.0015;
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.7), 3.5));
  };

  // Rotate 90 degrees
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Reset adjustments
  const handleReset = () => {
    setPosition({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  // Crop & Export to 512x512 File matching EXACT circle coordinates
  const handleApplyCrop = useCallback(() => {
    const img = imageRef.current;
    if (!img || !imgDimensions.width) return;

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // High quality smooth rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Clear background
    ctx.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    // Coordinate transformation:
    // 1. Move origin to center of 512x512 canvas
    ctx.save();
    ctx.translate(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2);

    // 2. Scale from CROP_SIZE (260px circle) to OUTPUT_SIZE (512px canvas)
    const exportScale = OUTPUT_SIZE / CROP_SIZE;
    ctx.scale(exportScale, exportScale);

    // 3. Apply user drag translation (in preview pixels)
    ctx.translate(position.x, position.y);

    // 4. Apply rotation and user zoom around center
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // 5. Draw image centered
    ctx.drawImage(
      img,
      -imgDimensions.width / 2,
      -imgDimensions.height / 2,
      imgDimensions.width,
      imgDimensions.height
    );

    ctx.restore();

    // Export as PNG or JPEG Blob (enforcing PNG/JPG format)
    const isPng = fileName.toLowerCase().endsWith(".png");
    const mimeType = isPng ? "image/png" : "image/jpeg";
    const ext = isPng ? ".png" : ".jpg";

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const cleanName = fileName.replace(/\.[^/.]+$/, "") + ext;
        const file = new File([blob], cleanName, { type: mimeType });
        onCrop(file);
      },
      mimeType,
      0.95
    );
  }, [position, zoom, rotation, fileName, imgDimensions, onCrop]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 select-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Adjust Profile Photo
              </h3>
              <p className="text-xs text-slate-500">
                Drag to reposition and use the slider to zoom
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="flex justify-center">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            className={`relative rounded-3xl overflow-hidden bg-slate-950 flex items-center justify-center cursor-${
              isDragging ? "grabbing" : "grab"
            } shadow-inner`}
            style={{ width: VIEWPORT_SIZE, height: VIEWPORT_SIZE }}
          >
            {/* Image Layer */}
            {imageLoaded && (
              <img
                src={imageSrc}
                alt="Crop preview"
                draggable={false}
                style={{
                  width: `${imgDimensions.width}px`,
                  height: `${imgDimensions.height}px`,
                  transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${zoom})`,
                  transformOrigin: "center center",
                  maxWidth: "none",
                  maxHeight: "none",
                  transition: isDragging ? "none" : "transform 0.05s ease-out",
                }}
                className="pointer-events-none user-select-none shrink-0"
              />
            )}

            {/* Circular Mask Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="w-full h-full"
                style={{
                  background: `radial-gradient(circle at center, transparent ${
                    CROP_SIZE / 2 - 0.5
                  }px, rgba(0, 0, 0, 0.75) ${CROP_SIZE / 2}px)`,
                }}
              />
              {/* Target Circle Ring */}
              <div
                className="absolute inset-0 m-auto rounded-full border-2 border-white pointer-events-none shadow-md"
                style={{ width: `${CROP_SIZE}px`, height: `${CROP_SIZE}px` }}
              >
                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-white bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs whitespace-nowrap">
                  <Move className="w-2.5 h-2.5" /> Drag to align
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls: Zoom Slider + Action Buttons */}
        <div className="space-y-3 pt-1">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3 px-2">
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(prev - 0.15, 0.7))}
              className="p-1.5 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <input
              type="range"
              min={0.7}
              max={3.5}
              step={0.02}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(prev + 0.15, 3.5))}
              className="p-1.5 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-600 w-10 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Additional Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleRotate}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Rotate 90°</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-all cursor-pointer active:scale-98"
          >
            <Check className="w-4 h-4" />
            <span>Apply &amp; Save Photo</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AvatarCropperModal;
