"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { saveAs } from "file-saver";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";
import { storage, firestore } from "@/lib/firebase";

/* ---------------- MAIN ROUTER ---------------- */

export default function GameRouter() {
  const params = useParams();
  const id = params.id;

  if (id === "1") return <CatsGame />;
  if (id === "2") return <PaintGame />;
  if (id === "3") return <CatchGame />;
  if (id === "4") return <SecretGame />;

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-red-500">Game not found.</p>
    </div>
  );
}

/* ---------------- BACK BUTTON ---------------- */

function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/")}
      className="absolute top-6 left-6 px-4 py-2 rounded-xl bg-white shadow hover:scale-105 transition z-50"
    >
      ← Back
    </button>
  );
}

/* ---------------- GAME 1: FIND THE CATS ---------------- */

function CatsGame() {
  const [cats, setCats] = useState<any[]>([]);
  const [found, setFound] = useState(0);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const minCats = 4;

  useEffect(() => {
    const storedHigh = localStorage.getItem("cat-highscore");
    if (storedHigh) setHighScore(Number(storedHigh));
  }, []);

  useEffect(() => {
    generateCats();
  }, [level]);

  const generateCats = () => {
    const maxCats = minCats + level * 2;
    const numberOfCats = Math.floor(Math.random() * (maxCats - minCats + 1)) + minCats;
    const baseSize = Math.max(70 - level * 8, 28);

    const generated = Array.from({ length: numberOfCats }).map((_, i) => ({
      id: i,
      top: Math.random() * 90,
      left: Math.random() * 90,
      size: baseSize + Math.random() * 20,
      src: Math.random() > 0.5 ? "/images/cats/cat1.png" : "/images/cats/cat2.png",
      visible: true,
    }));

    setCats(generated);
    setFound(0);
  };

  const clickCat = (id: number) => {
    setCats((prev) => prev.map((c) => (c.id === id ? { ...c, visible: false } : c)));
    setFound((f) => f + 1);
    setScore((s) => s + 10 * level);
  };

  useEffect(() => {
    if (found === cats.length && cats.length !== 0) {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("cat-highscore", score.toString());
      }
    }
  }, [found]);

  const nextLevel = () => setLevel((l) => l + 1);
  const restartGame = () => {
    setLevel(1);
    setScore(0);
    generateCats();
  };

  const backgrounds = [
    "/images/patterns/watercolorpattern1.png",
    "/images/patterns/watercolorpattern2.png",
    "/images/patterns/watercolorpattern3.png",
    "/images/patterns/watercolorpattern4.png",
  ];

  return (
    <div className="relative min-h-screen bg-[#FFF9F4] overflow-hidden p-6">
      <BackButton />

      <h1 className="text-4xl text-center text-[#F77F7F] font-handwriting pt-6">
        Find the Cats 🐱
      </h1>

      <div className="flex justify-center gap-6 mt-4 text-gray-600">
        <p>Level: {level}</p>
        <p>Score: {score}</p>
        <p>High Score: {highScore}</p>
        <p>Found: {found}/{cats.length}</p>
      </div>

      <div
        className="relative mt-6 mx-auto rounded-xl w-full h-[70vh] border border-dashed border-gray-300 overflow-hidden"
        style={{ backgroundColor: "#FFF9F4" }}
      >
        <img
          src={backgrounds[level - 1] || backgrounds[backgrounds.length - 1]}
          className="absolute inset-0 w-full h-full opacity-20 pointer-events-none object-cover"
          alt={`background stage ${level}`}
        />

        {cats.map(cat => cat.visible && (
          <img
            key={cat.id}
            src={cat.src}
            onClick={() => clickCat(cat.id)}
            className="absolute cursor-pointer floating-cat"
            style={{
              top: `${cat.top}%`,
              left: `${cat.left}%`,
              width: `${cat.size}px`,
            }}
          />
        ))}
      </div>

      {found === cats.length && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl text-[#F77F7F] mb-3">Level Complete 🎉</h2>
            <p className="text-gray-500 mb-4">Score: {score}</p>
            <div className="flex gap-4 justify-center">
              <button onClick={nextLevel} className="bg-[#F77F7F] text-white px-4 py-2 rounded-lg">Next Level</button>
              <button onClick={restartGame} className="bg-gray-200 px-4 py-2 rounded-lg">Restart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- GAME 2: PAINT ---------------- */
function PaintGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);

  const [tool, setTool] = useState<"brush" | "eraser" | "line" | "rectangle" | "circle">("brush");
  const [brushColor, setBrushColor] = useState("#F77F7F");
  const [brushSize, setBrushSize] = useState(4);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [brushLineCap, setBrushLineCap] = useState<CanvasLineCap>("round");
  const [brushLineJoin, setBrushLineJoin] = useState<CanvasLineJoin>("round");
  const [downloadFormat, setDownloadFormat] = useState<"png" | "jpeg">("png");

  const [canvasWidth, setCanvasWidth] = useState<number>(400);
  const [canvasHeight, setCanvasHeight] = useState<number>(700);
  const [showCanvas, setShowCanvas] = useState(false);

  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const lastMousePos = useRef<{ x: number; y: number } | null>(null);

  const presets = [
    { name: "Phone Wallpaper", width: 1080, height: 1920 },
    { name: "Logo", width: 500, height: 500 },
    { name: "Presentation", width: 1280, height: 720 },
    { name: "Flyer", width: 1080, height: 1920 },
  ];

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = brushSize;
    ctx.lineCap = brushLineCap;
    ctx.lineJoin = brushLineJoin;
    ctx.strokeStyle = brushColor;
    ctx.globalAlpha = brushOpacity;
  };

  useEffect(() => {
    if (showCanvas) initCanvas();
  }, [brushSize, brushColor, brushOpacity, brushLineCap, brushLineJoin, tool, showCanvas]);

  const pushUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setUndoStack((prev) => [...prev, canvas.toDataURL()]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const last = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, canvas.toDataURL()]);

    const img = new Image();
    img.src = last;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const last = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, canvas.toDataURL()]);

    const img = new Image();
    img.src = last;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const getCursorPosition = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    pushUndo();

    const { x, y } = getCursorPosition(e);
    setStartPoint({ x, y });
    lastMousePos.current = { x, y };

    if (tool === "brush" || tool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas || !startPoint) return;

    const { x, y } = getCursorPosition(e);
    lastMousePos.current = { x, y };

    ctx.lineWidth = brushSize;
    ctx.lineCap = brushLineCap;
    ctx.lineJoin = brushLineJoin;

    if (tool === "brush") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = brushColor;
      ctx.globalAlpha = brushOpacity;
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === "line" || tool === "rectangle" || tool === "circle") {
      const img = new Image();
      img.src = undoStack[undoStack.length - 1] || "";
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (undoStack.length > 0) ctx.drawImage(img, 0, 0);
        drawShape(ctx, startPoint.x, startPoint.y, x, y);
      };
    }
  };

  const drawShape = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = brushColor;
    ctx.globalAlpha = brushOpacity;

    if (tool === "line") {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    } else if (tool === "rectangle") {
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    } else if (tool === "circle") {
      ctx.beginPath();
      const radius = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      ctx.arc(x1, y1, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const stopDraw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    if (tool === "line" || tool === "rectangle" || tool === "circle") {
      if (startPoint && lastMousePos.current) {
        drawShape(ctx, startPoint.x, startPoint.y, lastMousePos.current.x, lastMousePos.current.y);
      }
      pushUndo();
    }

    setDrawing(false);
    setStartPoint(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    pushUndo();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (blob) saveAs(blob, `my-art.${downloadFormat}`);
    }, `image/${downloadFormat}`);
  };

  const confirmSize = () => setShowCanvas(true);

  if (!showCanvas)
    return (
      <div className="relative min-h-screen bg-[#FFF9F4] flex flex-col items-center pt-16 px-4">
        <BackButton />
        <h1 className="text-4xl text-[#F77F7F] font-handwriting mb-6">Choose Canvas Size 🎨</h1>

        <div className="flex flex-col gap-4 w-full max-w-md">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setCanvasWidth(p.width);
                setCanvasHeight(p.height);
                confirmSize();
              }}
              className="w-full py-2 bg-[#F77F7F] text-white rounded-lg hover:scale-105 transition"
            >
              {p.name} ({p.width}×{p.height})
            </button>
          ))}

          <div className="border p-4 rounded-lg flex flex-col gap-2">
            <p className="font-semibold">Custom Size</p>
            <label className="flex justify-between items-center">
              Width:
              <input
                type="number"
                value={canvasWidth}
                onChange={(e) => setCanvasWidth(Number(e.target.value))}
                className="border rounded px-2 py-1 w-24"
              />
            </label>
            <label className="flex justify-between items-center">
              Height:
              <input
                type="number"
                value={canvasHeight}
                onChange={(e) => setCanvasHeight(Number(e.target.value))}
                className="border rounded px-2 py-1 w-24"
              />
            </label>
            <button
              onClick={confirmSize}
              className="mt-2 bg-green-400 text-white py-2 rounded-lg"
            >
              Confirm Size
            </button>
          </div>
        </div>
      </div>
    );

    const saveToFirebase = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
        if (!blob) {
        console.log("No blob created from canvas");
        return;
        }

        try {
        const fileRef = ref(storage, `drawings/${Date.now()}.png`);
        console.log("Uploading to Storage:", fileRef.fullPath);

        const snapshot = await uploadBytes(fileRef, blob);
        console.log("Upload complete:", snapshot);

        const url = await getDownloadURL(fileRef);
        console.log("Download URL:", url);

        const docRef = await addDoc(collection(firestore, "drawings"), {
            url,
            createdAt: serverTimestamp(),
        });

        console.log("Firestore document created:", docRef.id);
        alert("Drawing saved to your gallery!");
        } catch (err) {
        console.error("Firebase save error:", err);
        alert("Failed to save drawing.");
        }
    }, "image/png");
    };

  return (
    <div className="relative min-h-screen bg-[#FFF9F4] flex flex-col items-center pt-6 px-4">
      <BackButton />

      <h1 className="text-4xl text-center text-[#F77F7F] font-handwriting pt-6">
        Paint Together 🎨
      </h1>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-4 justify-center mb-4 items-center">
        <div className="flex gap-2 bg-gray-100 p-2 rounded shadow-sm">
          <button onClick={() => setTool("brush")} className={`px-3 py-1 rounded ${tool==="brush"?"bg-[#F77F7F] text-white":"bg-gray-200"}`}>Brush</button>
          <button onClick={() => setTool("eraser")} className={`px-3 py-1 rounded ${tool==="eraser"?"bg-[#F77F7F] text-white":"bg-gray-200"}`}>Eraser</button>
          <button onClick={() => setTool("line")} className={`px-3 py-1 rounded ${tool==="line"?"bg-[#F77F7F] text-white":"bg-gray-200"}`}>Line</button>
          <button onClick={() => setTool("rectangle")} className={`px-3 py-1 rounded ${tool==="rectangle"?"bg-[#F77F7F] text-white":"bg-gray-200"}`}>Rect</button>
          <button onClick={() => setTool("circle")} className={`px-3 py-1 rounded ${tool==="circle"?"bg-[#F77F7F] text-white":"bg-gray-200"}`}>Circle</button>
        </div>

        <div className="flex gap-2 bg-gray-100 p-2 rounded shadow-sm">
          <input type="color" value={brushColor} disabled={tool==="eraser"} onChange={(e)=>setBrushColor(e.target.value)} className="w-10 h-10 rounded-full border" />
          <label className="flex items-center gap-1">Size <input type="range" min="1" max="50" value={brushSize} onChange={(e)=>setBrushSize(Number(e.target.value))} /></label>
          <label className="flex items-center gap-1">Opacity <input type="range" min="0.1" max="1" step="0.05" value={brushOpacity} onChange={(e)=>setBrushOpacity(Number(e.target.value))} /></label>
        </div>

        <div className="flex gap-2 bg-gray-100 p-2 rounded shadow-sm">
          <button onClick={undo} disabled={undoStack.length===0} className={`px-3 py-1 rounded text-white ${undoStack.length===0?"bg-gray-300 cursor-not-allowed":"bg-yellow-400"}`}>Undo</button>
          <button onClick={redo} disabled={redoStack.length===0} className={`px-3 py-1 rounded text-white ${redoStack.length===0?"bg-gray-300 cursor-not-allowed":"bg-orange-400"}`}>Redo</button>
          <button onClick={clearCanvas} className="px-3 py-1 rounded bg-[#F77F7F] text-white">Clear</button>
          <select value={downloadFormat} onChange={(e)=>setDownloadFormat(e.target.value as "png"|"jpeg")} className="rounded border px-2 py-1">
            <option value="png">PNG</option>
            <option value="jpeg">JPG</option>
          </select>
          <button onClick={downloadCanvas} className="px-3 py-1 rounded bg-green-400 text-white">Download</button>
          {/* <button onClick={saveToFirebase} className="px-3 py-1 rounded bg-green-400 text-white">Save</button> */}
        </div>
      </div>

      <div className="w-full max-w-full overflow-auto p-2 flex justify-center">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          className="bg-white rounded-xl shadow-lg border"
          style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain" }}
        />
      </div>
    </div>
  );
}

/* ---------------- GAME 3: CATCH HEART ---------------- */

function CatchGame() {
  const [hearts, setHearts] = useState<any[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts((prev) => [
        ...prev,
        { id: Date.now(), left: Math.random() * 90, top: 0 },
      ]);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fall = setInterval(() => {
      setHearts((prev) =>
        prev.map((h) => ({ ...h, top: h.top + 5 })).filter((h) => h.top < 100)
      );
    }, 120);
    return () => clearInterval(fall);
  }, []);

  const catchHeart = (id: number) => {
    setHearts((prev) => prev.filter((h) => h.id !== id));
    setScore((s) => s + 1);
  };

  return (
    <div className="relative min-h-screen bg-[#FFF9F4] overflow-hidden">
      <BackButton />
      <h1 className="text-4xl text-center pt-16 text-[#F77F7F] font-handwriting">
        Catch My Heart ❤️
      </h1>
      <p className="text-center mt-2">Score: {score}</p>
      {hearts.map((heart) => (
        <img
          key={heart.id}
          src="/images/patterns/heart.png"
          onClick={() => catchHeart(heart.id)}
          className="absolute w-12 cursor-pointer"
          style={{ top: `${heart.top}%`, left: `${heart.left}%` }}
        />
      ))}
    </div>
  );
}

/* ---------------- PHOTOBOOTH ---------------- */
/* ---------------- PHOTOBOOTH ---------------- */
function SecretGame() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [takingPhotos, setTakingPhotos] = useState(false);
  const [stripTitle, setStripTitle] = useState("Choose a header");
  const [animatePhoto, setAnimatePhoto] = useState<string | null>(null);

  // Start camera
  const startCamera = async () => {
    if (cameraOn) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch (err) {
      alert("Cannot access camera. Please check permissions.");
    }
  };

  // Take a photo with countdown
  const takePhotobooth = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setTakingPhotos(true);

    for (let c = 3; c > 0; c--) {
      setCountdown(c);
      await new Promise((r) => setTimeout(r, 1000));
    }
    setCountdown(null);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 300;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const photo = canvas.toDataURL("image/png");

    // Animate photo flying into gallery
    setAnimatePhoto(photo);
    await new Promise((r) => setTimeout(r, 500));

    setCapturedPhotos((prev) => {
      if (prev.length < 4) return [...prev, photo];
      const newPhotos = [...prev];
      newPhotos[prev.length - 1] = photo;
      return newPhotos;
    });

    setAnimatePhoto(null);
    setTakingPhotos(false);
  };

  const deletePhoto = (index: number) => setCapturedPhotos(prev => prev.filter((_, i) => i !== index));
  const retake = () => setCapturedPhotos([]);

const downloadStrip = async () => {
  if (capturedPhotos.length === 0) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const stripWidth = 260;
  const maxPhotoHeight = 300;
  const gap = 10; // smaller, fixed gap between photos
  const padding = 20;

  // Load all images first
  const loadedImages: HTMLImageElement[] = await Promise.all(
    capturedPhotos.map(
      (p) =>
        new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.src = p;
          img.onload = () => resolve(img);
        })
    )
  );

  // Calculate total height dynamically
  const photoHeights = loadedImages.map((img) => {
    const ratio = Math.min(stripWidth / img.width, maxPhotoHeight / img.height);
    return img.height * ratio;
  });
  const totalHeight = photoHeights.reduce((a, b) => a + b, 0) + gap * (loadedImages.length - 1) + 140;

  canvas.width = stripWidth + padding * 2;
  canvas.height = totalHeight;

  // Background
  ctx.fillStyle = "#FFE4EC";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Decorative dots
  ctx.fillStyle = "#F77F7F";
  for (let y = 20; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.arc(10, y, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(canvas.width - 10, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw photos
  let currentY = padding;
  loadedImages.forEach((img, i) => {
    const ratio = Math.min(stripWidth / img.width, maxPhotoHeight / img.height);
    const drawWidth = img.width * ratio;
    const drawHeight = img.height * ratio;
    const offsetX = padding + (stripWidth - drawWidth) / 2;

    ctx.fillStyle = "white";
    ctx.fillRect(offsetX - 5, currentY - 5, drawWidth + 10, drawHeight + 10);

    ctx.drawImage(img, offsetX, currentY, drawWidth, drawHeight);

    currentY += drawHeight + gap; // move to next photo position
  });

  // Draw title & date
  ctx.fillStyle = "#F77F7F";
  ctx.font = "22px Inter";
  ctx.textAlign = "center";
  ctx.fillText(stripTitle || "Photobooth", canvas.width / 2, canvas.height - 60);

  ctx.fillStyle = "#888";
  ctx.font = "14px Inter";
  ctx.fillText(new Date().toLocaleDateString(), canvas.width / 2, canvas.height - 35);

  // Download
  const link = document.createElement("a");
  link.download = "photobooth-strip.png";
  link.href = canvas.toDataURL();
  link.click();
};

  return (
    <div className="relative min-h-screen flex flex-col items-center bg-[#FFF9F4] pt-10 px-4 md:px-10">
      <BackButton />

      <h1 className="text-3xl md:text-4xl font-handwriting text-[#F77F7F] mb-4 text-center">
        Photobooth 📸
      </h1>

      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto gap-8 p-4">
        {/* Camera Section */}
        <div className="relative w-full md:w-1/2 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col items-center justify-center p-4">
          {!cameraOn && (
            <button
              onClick={startCamera}
              className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg shadow-lg transition hover:scale-105"
            >
              Start Camera
            </button>
          )}

          <video
            ref={videoRef}
            autoPlay
            className={`w-full rounded-xl shadow-lg aspect-video object-cover border border-gray-200 dark:border-gray-700 ${
              cameraOn ? "block" : "hidden"
            }`}
          />

          {countdown && (
            <div className="absolute inset-0 flex items-center justify-center text-6xl md:text-7xl font-bold text-white bg-black/40 rounded-xl animate-pulse">
              {countdown}
            </div>
          )}

          {animatePhoto && (
            <img
              src={animatePhoto}
              className="animate-fly absolute w-20 md:w-28 rounded-lg shadow-lg top-2 left-2 border border-white"
            />
          )}

          {cameraOn && (
            <div className="mt-4 w-full flex flex-col items-center gap-3">
              <div className="flex gap-3 flex-wrap justify-center">
                <button
                  onClick={takePhotobooth}
                  disabled={takingPhotos}
                  className={`px-5 py-2 rounded-lg text-white font-medium shadow-md transition hover:scale-105 ${
                    takingPhotos ? "bg-gray-400 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"
                  }`}
                >
                  Take Photo
                </button>

                <button
                  onClick={retake}
                  className="px-5 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-medium shadow-md transition hover:scale-105"
                >
                  Retake
                </button>

                <button
                  onClick={downloadStrip}
                  className="px-5 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium shadow-md transition hover:scale-105"
                >
                  Download Strip
                </button>
              </div>

              <input
                value={stripTitle}
                onChange={(e) => setStripTitle(e.target.value)}
                placeholder="Enter photobooth title..."
                className="mt-3 w-72 md:w-96 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-center focus:outline-none focus:ring-2 focus:ring-pink-400 dark:bg-gray-700 dark:text-white"
              />
            </div>
          )}
        </div>

        {/* Photo Grid Section */}
        {cameraOn && (
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Photo Gallery
            </h2>

            {capturedPhotos.length === 0 ? (
              <div className="flex items-center justify-center h-60 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-center p-4">
                No photos taken yet. Take your first photo!
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                {capturedPhotos.map((p, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={p}
                      className="w-full h-52 md:h-60 object-cover rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm"
                    />
                    <button
                      onClick={() => deletePhoto(i)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-md"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}