"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { saveAs } from "file-saver";
import { motion } from "framer-motion";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";
import { storage, firestore } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Trophy, Target, Star, Camera, Image, Download, RotateCcw, Heart, Sparkles } from "lucide-react";

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
    <Button
      onClick={() => router.push("/")}
      variant="outline"
      size="sm"
      className="absolute top-4 left-4 z-50 shadow-md"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back
    </Button>
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
    if (typeof window !== 'undefined') {
      const storedHigh = localStorage.getItem("cat-highscore");
      if (storedHigh) setHighScore(Number(storedHigh));
    }
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
        if (typeof window !== 'undefined') {
          localStorage.setItem("cat-highscore", score.toString());
        }
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50 p-4 relative overflow-hidden">
      {/* 3D Floating Elements */}
      <div className='absolute inset-0 pointer-events-none'>
        <motion.div
          animate={{
            x: [0, 100, 200, 100, 0],
            y: [0, -50, -100, -50, 0],
            rotate: [0, 45, 90, 45, 0],
            scale: [0.8, 1.2, 1.6, 1.2, 0.8]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className='absolute top-1/4 left-1/4 w-4 h-4 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full opacity-20 blur-sm'
        />

        <motion.div
          animate={{
            x: [200, 150, 100, 150, 200],
            y: [100, 50, 100, 150, 100],
            rotate: [0, -45, -90, -45, 0],
            scale: [1, 1.3, 1, 0.7, 1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          className='absolute top-1/3 right-1/4 w-3 h-3 bg-gradient-to-r from-rose-300 to-red-300 rounded-full opacity-25 blur-sm'
        />
      </div>

      <BackButton />

      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-pink-200/50">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
              Find the Cats
            </h1>
            <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-200/50">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-pink-700 font-medium">Click on all the cats to complete the level! 🐱💕</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center gap-4 mb-6"
        >
          <Badge className="px-4 py-2 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 border border-pink-200 shadow-lg">
            <Target className="mr-2 h-4 w-4" />
            Level {level}
          </Badge>
          <Badge className="px-4 py-2 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 border border-rose-200 shadow-lg">
            <Star className="mr-2 h-4 w-4" />
            Score: {score}
          </Badge>
          <Badge variant="outline" className="px-4 py-2 border-pink-300 text-pink-700 bg-pink-50/50 shadow-lg">
            <Trophy className="mr-2 h-4 w-4" />
            Best: {highScore}
          </Badge>
          <Badge className="px-4 py-2 bg-gradient-to-r from-pink-200 to-rose-200 text-pink-900 border border-pink-300 shadow-lg">
            Found: {found}/{cats.length}
          </Badge>
        </motion.div>

        {/* Game Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative mx-auto rounded-xl w-full max-w-2xl h-[60vh] border-2 border-dashed border-pink-300 overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50 shadow-3d"
        >
          <img
            src={backgrounds[level - 1] || backgrounds[backgrounds.length - 1]}
            className="absolute inset-0 w-full h-full opacity-30 pointer-events-none object-cover"
            alt={`background stage ${level}`}
          />

          {cats.map(cat => cat.visible && (
            <motion.img
              key={cat.id}
              src={cat.src}
              onClick={() => clickCat(cat.id)}
              className="absolute cursor-pointer drop-shadow-lg"
              style={{
                top: `${cat.top}%`,
                left: `${cat.left}%`,
                width: `${cat.size}px`,
              }}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.8 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          ))}
        </motion.div>

        {/* Level Complete Modal */}
        {found === cats.length && cats.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center bg-pink-900/20 backdrop-blur-md z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotateX: -15 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="perspective-1000"
            >
              <Card className="w-full max-w-md shadow-3d border-2 border-pink-200 bg-gradient-to-br from-white to-pink-50/50">
                <CardHeader className="text-center bg-gradient-to-r from-pink-50 to-rose-50 rounded-t-lg">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Trophy className="h-5 w-5 text-white" />
                    </motion.div>
                    <CardTitle className="text-pink-800">Level Complete! 🎉</CardTitle>
                    <motion.div
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      className="w-10 h-10 bg-gradient-to-r from-rose-500 to-red-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Sparkles className="h-5 w-5 text-white" />
                    </motion.div>
                  </div>
                  <p className="text-pink-600 font-medium">Great job finding all the cats! 🐱💕</p>
                </CardHeader>
                <CardContent className="text-center space-y-4 p-6">
                  <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                    Score: {score}
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={nextLevel}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-200/50"
                    >
                      Next Level ✨
                    </Button>
                    <Button
                      onClick={restartGame}
                      variant="outline"
                      className="flex-1 border-pink-300 text-pink-700 hover:bg-pink-50 hover:border-pink-400"
                    >
                      Restart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </div>
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

    const img = new window.Image();
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

    const img = new window.Image();
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
    }
    setDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const { x, y } = getCursorPosition(e);

    if (tool === "brush") {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === "eraser") {
      ctx.clearRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
    } else if (tool === "line" && startPoint) {
      // Preview line
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCtx.drawImage(canvas, 0, 0);
      tempCtx.beginPath();
      tempCtx.moveTo(startPoint.x, startPoint.y);
      tempCtx.lineTo(x, y);
      tempCtx.stroke();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(tempCanvas, 0, 0);
    }
  };

  const stopDraw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    if (tool === "line" && startPoint) {
      const { x, y } = getCursorPosition(e);
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === "rectangle" && startPoint) {
      const { x, y } = getCursorPosition(e);
      const width = x - startPoint.x;
      const height = y - startPoint.y;
      ctx.strokeRect(startPoint.x, startPoint.y, width, height);
    } else if (tool === "circle" && startPoint) {
      const { x, y } = getCursorPosition(e);
      const radius = Math.sqrt((x - startPoint.x) ** 2 + (y - startPoint.y) ** 2);
      ctx.beginPath();
      ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
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
    const link = document.createElement("a");
    link.download = `painting.${downloadFormat}`;
    link.href = canvas.toDataURL(`image/${downloadFormat}`);
    link.click();
  };

  const confirmSize = () => setShowCanvas(true);

  if (!showCanvas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-4">
        <BackButton />

        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Paint Together
            </h1>
            <p className="text-muted-foreground">Create beautiful art with your friends</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Choose Canvas Size</CardTitle>
                <CardDescription>Select a preset or set custom dimensions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  {presets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      onClick={() => {
                        setCanvasWidth(preset.width);
                        setCanvasHeight(preset.height);
                        confirmSize();
                      }}
                      className="justify-start"
                    >
                      {preset.name} ({preset.width}×{preset.height})
                    </Button>
                  ))}
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold">Custom Size</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="width">Width</Label>
                      <Input
                        id="width"
                        type="number"
                        value={canvasWidth}
                        onChange={(e) => setCanvasWidth(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="height">Height</Label>
                      <Input
                        id="height"
                        type="number"
                        value={canvasHeight}
                        onChange={(e) => setCanvasHeight(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <Button onClick={confirmSize} className="w-full">
                    Start Painting
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50 p-4 relative overflow-hidden">
      {/* 3D Floating Elements */}
      <div className='absolute inset-0 pointer-events-none'>
        <motion.div
          animate={{
            x: [0, 150, 300, 150, 0],
            y: [0, -80, -160, -80, 0],
            rotate: [0, 60, 120, 60, 0],
            scale: [0.6, 1.4, 2.0, 1.4, 0.6]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className='absolute top-1/5 left-1/5 w-5 h-5 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full opacity-15 blur-sm'
        />

        <motion.div
          animate={{
            x: [300, 200, 100, 200, 300],
            y: [150, 80, 150, 220, 150],
            rotate: [0, -60, -120, -60, 0],
            scale: [1.2, 1.6, 1.2, 0.8, 1.2]
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className='absolute top-2/5 right-1/5 w-4 h-4 bg-gradient-to-r from-rose-300 to-red-300 rounded-full opacity-20 blur-sm'
        />
      </div>

      <BackButton />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-pink-200/50">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
              Romantic Canvas
            </h1>
            <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-200/50">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-pink-700 font-medium">Create beautiful art with romantic colors! 🎨💕</p>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <Card className="shadow-3d border-2 border-pink-200 bg-gradient-to-r from-white/90 to-pink-50/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Tool Selection */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-pink-800">Tool:</Label>
                  <select
                    value={tool}
                    onChange={(e) => setTool(e.target.value as any)}
                    className="px-3 py-1 border border-pink-300 rounded-md text-sm bg-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  >
                    <option value="brush">Brush</option>
                    <option value="eraser">Eraser</option>
                    <option value="line">Line</option>
                    <option value="rectangle">Rectangle</option>
                    <option value="circle">Circle</option>
                  </select>
                </div>

                {/* Color Picker */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-pink-800">Color:</Label>
                  <input
                    type="color"
                    value={brushColor}
                    onChange={(e) => setBrushColor(e.target.value)}
                    className="w-8 h-8 rounded border border-pink-300 cursor-pointer focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  />
                </div>

                {/* Brush Size */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-pink-800">Size:</Label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-20 accent-pink-500"
                  />
                  <span className="text-sm text-pink-600 font-medium w-8">{brushSize}</span>
                </div>

                {/* Opacity */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-pink-800">Opacity:</Label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={brushOpacity}
                    onChange={(e) => setBrushOpacity(Number(e.target.value))}
                    className="w-20 accent-rose-500"
                  />
                  <span className="text-sm text-rose-600 font-medium w-8">{Math.round(brushOpacity * 100)}%</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-pink-200">
                <Button
                  onClick={undo}
                  disabled={undoStack.length === 0}
                  variant="outline"
                  size="sm"
                  className="border-pink-300 text-pink-700 hover:bg-pink-50 hover:border-pink-400"
                >
                  <Undo className="h-4 w-4 mr-1" />
                  Undo
                </Button>
                <Button
                  onClick={redo}
                  disabled={redoStack.length === 0}
                  variant="outline"
                  size="sm"
                  className="border-rose-300 text-rose-700 hover:bg-rose-50 hover:border-rose-400"
                >
                  <Redo className="h-4 w-4 mr-1" />
                  Redo
                </Button>
                <Button
                  onClick={clearCanvas}
                  variant="outline"
                  size="sm"
                  className="border-pink-300 text-pink-700 hover:bg-pink-50 hover:border-pink-400"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </Button>
                <select
                  value={downloadFormat}
                  onChange={(e) => setDownloadFormat(e.target.value as "png" | "jpeg")}
                  className="px-3 py-1 border border-pink-300 rounded-md text-sm bg-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                >
                  <option value="png">PNG</option>
                  <option value="jpeg">JPEG</option>
                </select>
                <Button
                  onClick={downloadCanvas}
                  size="sm"
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-200/50"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center"
        >
          <div className="border-2 border-dashed border-pink-300 rounded-lg p-4 bg-gradient-to-br from-pink-50 to-rose-50 shadow-3d">
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              className="bg-white rounded-lg shadow-lg border border-pink-200 max-w-full max-h-[70vh] cursor-crosshair"
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain"
              }}
            />
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-6 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200"
        >
          <p className="text-pink-700 font-medium">
            💡 <strong>Romantic Tip:</strong> Use the passionate color palette to create beautiful artwork! Mix pink, rose, and red tones for a masterpiece full of love. 🎨💕
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/* ---------------- GAME 3: CATCH HEART ---------------- */

function CatchGame() {
  const [hearts, setHearts] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    // Load high score from localStorage
    const saved = localStorage.getItem('catch-heart-high-score');
    if (saved) setHighScore(Number(saved));
  }, []);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      setHearts((prev) => [
        ...prev,
        { id: Date.now(), left: Math.random() * 90, top: 0 },
      ]);
    }, 900);
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const fall = setInterval(() => {
      setHearts((prev) =>
        prev.map((h) => ({ ...h, top: h.top + 5 })).filter((h) => h.top < 100)
      );
    }, 120);
    return () => clearInterval(fall);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          // Save high score
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('catch-heart-high-score', score.toString());
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameStarted, gameOver, score, highScore]);

  const catchHeart = (id: number) => {
    if (!gameStarted || gameOver) return;
    setHearts((prev) => prev.filter((h) => h.id !== id));
    setScore((s) => s + 1);
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(30);
    setHearts([]);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setTimeLeft(30);
    setHearts([]);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50 p-4 relative overflow-hidden">
        {/* 3D Floating Elements */}
        <div className='absolute inset-0 pointer-events-none'>
          <motion.div
            animate={{
              x: [0, 200, 400, 200, 0],
              y: [0, -100, -200, -100, 0],
              rotate: [0, 90, 180, 90, 0],
              scale: [0.8, 1.6, 2.4, 1.6, 0.8]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className='absolute top-1/3 left-1/3 w-6 h-6 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full opacity-10 blur-sm'
          />

          <motion.div
            animate={{
              x: [400, 300, 200, 300, 400],
              y: [200, 100, 200, 300, 200],
              rotate: [0, -90, -180, -90, 0],
              scale: [1.4, 2.0, 1.4, 0.6, 1.4]
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5
            }}
            className='absolute top-1/2 right-1/3 w-5 h-5 bg-gradient-to-r from-rose-300 to-red-300 rounded-full opacity-15 blur-sm'
          />
        </div>

        <BackButton />

        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-pink-200/50">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
                Catch My Heart
              </h1>
              <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-200/50">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-pink-700 font-medium">Catch falling hearts before they disappear! 💕</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <Card className="w-full max-w-md shadow-3d border-2 border-pink-200 bg-gradient-to-br from-white to-pink-50/50">
              <CardHeader className="text-center bg-gradient-to-r from-pink-50 to-rose-50 rounded-t-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Heart className="h-4 w-4 text-white" />
                  </motion.div>
                  <CardTitle className="text-pink-800">Ready to Play?</CardTitle>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="w-8 h-8 bg-gradient-to-r from-rose-500 to-red-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Sparkles className="h-4 w-4 text-white" />
                  </motion.div>
                </div>
                <CardDescription className="text-pink-600">
                  You have 30 seconds to catch as many hearts as possible! 💕
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="text-center">
                  <div className="text-lg font-semibold text-pink-700 mb-1">High Score</div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">{highScore}</div>
                </div>
                <Button
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-200/50"
                  size="lg"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Start Game 💕
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <BackButton />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-bold mb-2">Catch My Heart</h1>
          <p className="text-muted-foreground">Catch the falling hearts!</p>
        </motion.div>

        {/* Game Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Score</div>
                    <div className="text-2xl font-bold text-primary">{score}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Time Left</div>
                    <div className="text-2xl font-bold text-destructive">{timeLeft}s</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">High Score</div>
                    <div className="text-2xl font-bold text-muted-foreground">{highScore}</div>
                  </div>
                </div>
                <Button onClick={resetGame} variant="outline">
                  Reset Game
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Game Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative"
        >
          <div className="relative h-96 bg-gradient-to-b from-sky-100 to-sky-200 dark:from-sky-900/20 dark:to-sky-800/20 rounded-lg border-2 border-dashed border-muted-foreground/20 overflow-hidden">
            {hearts.map((heart) => (
              <motion.img
                key={heart.id}
                src="/images/patterns/heart.png"
                onClick={() => catchHeart(heart.id)}
                className="absolute w-12 h-12 cursor-pointer hover:scale-110 transition-transform"
                style={{ top: `${heart.top}%`, left: `${heart.left}%` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}

            {gameOver && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg"
              >
                <Card className="w-full max-w-md mx-4">
                  <CardHeader className="text-center">
                    <CardTitle>Game Over!</CardTitle>
                    <CardDescription>
                      Final Score: {score}
                      {score === highScore && score > 0 && " 🎉 New High Score!"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={startGame} className="w-full">
                      Play Again
                    </Button>
                    <Button onClick={resetGame} variant="outline" className="w-full">
                      Back to Menu
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
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
  const [stripTitle, setStripTitle] = useState("Photobooth Fun");
  const [animatePhoto, setAnimatePhoto] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<string>("none");

  const filters = [
    { name: "None", value: "none" },
    { name: "Vintage", value: "sepia(0.3) contrast(1.1) brightness(1.1)" },
    { name: "Cool", value: "hue-rotate(180deg) saturate(1.2)" },
    { name: "Warm", value: "hue-rotate(20deg) saturate(1.3) brightness(1.1)" },
    { name: "Dramatic", value: "contrast(1.5) brightness(0.9) saturate(1.2)" },
  ];

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
    ctx.filter = currentFilter;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    ctx.filter = "none";

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

    const stripWidth = 280;
    const maxPhotoHeight = 320;
    const gap = 15;
    const padding = 25;

    // Load all images first
    const loadedImages: HTMLImageElement[] = await Promise.all(
      capturedPhotos.map(
        (p) =>
          new Promise<HTMLImageElement>((resolve) => {
            const img = new window.Image();
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
    const totalHeight = photoHeights.reduce((a, b) => a + b, 0) + gap * (loadedImages.length - 1) + 160;

    canvas.width = stripWidth + padding * 2;
    canvas.height = totalHeight;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#fef2f2");
    gradient.addColorStop(0.5, "#fce7f3");
    gradient.addColorStop(1, "#fef2f2");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative elements
    ctx.strokeStyle = "#f472b6";
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

    // Heart decorations
    ctx.fillStyle = "#f472b6";
    for (let i = 0; i < 8; i++) {
      const x = 20 + (i * (canvas.width - 40) / 7);
      const y = 20;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw photos with pink borders
    let currentY = padding + 30;
    loadedImages.forEach((img, i) => {
      const ratio = Math.min(stripWidth / img.width, maxPhotoHeight / img.height);
      const drawWidth = img.width * ratio;
      const drawHeight = img.height * ratio;
      const offsetX = padding + (stripWidth - drawWidth) / 2;

      // Pink photo frame
      ctx.fillStyle = "#fce7f3";
      ctx.fillRect(offsetX - 8, currentY - 8, drawWidth + 16, drawHeight + 16);
      ctx.strokeStyle = "#f472b6";
      ctx.lineWidth = 3;
      ctx.strokeRect(offsetX - 8, currentY - 8, drawWidth + 16, drawHeight + 16);

      ctx.drawImage(img, offsetX, currentY, drawWidth, drawHeight);

      currentY += drawHeight + gap;
    });

    // Draw title with gradient
    const titleGradient = ctx.createLinearGradient(0, canvas.height - 80, canvas.width, canvas.height - 80);
    titleGradient.addColorStop(0, "#be185d");
    titleGradient.addColorStop(1, "#f472b6");
    ctx.fillStyle = titleGradient;
    ctx.font = "bold 24px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(stripTitle || "Photobooth Fun", canvas.width / 2, canvas.height - 70);

    // Date with pink color
    ctx.fillStyle = "#be185d";
    ctx.font = "16px system-ui";
    ctx.fillText(new Date().toLocaleDateString(), canvas.width / 2, canvas.height - 45);

    // Fun emoji
    ctx.font = "20px system-ui";
    ctx.fillText("📸✨💖", canvas.width / 2, canvas.height - 20);

    // Download
    const link = document.createElement("a");
    link.download = "photobooth-strip.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  if (!cameraOn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50 p-4">
        <BackButton />

        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-red-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
              Photobooth
            </h1>
            <p className="text-pink-700 text-lg">Create magical photo strips with your friends</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <Card className="w-full max-w-md border-pink-200 shadow-xl shadow-pink-100/50">
              <CardHeader className="text-center bg-gradient-to-r from-pink-50 to-rose-50 rounded-t-lg">
                <CardTitle className="text-pink-800 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Ready for Photos?
                </CardTitle>
                <CardDescription className="text-pink-600">
                  Take up to 4 photos to create a magical photobooth strip!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 mx-auto bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center mb-4 shadow-lg"
                  >
                    <Camera className="w-12 h-12 text-white" />
                  </motion.div>
                  <p className="text-sm text-pink-600 font-medium">Let's capture some memories! ✨</p>
                </div>
                <Button
                  onClick={startCamera}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-200/50"
                  size="lg"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Start Camera
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50 p-4">
      <BackButton />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Photobooth
            </h1>
            <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-red-500 rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-pink-700">Create magical photo strips with your friends</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Camera Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-pink-200 shadow-xl shadow-pink-100/50">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-pink-800">
                  <Camera className="w-5 h-5" />
                  Camera
                  <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                    {capturedPhotos.length}/4
                  </Badge>
                </CardTitle>
                <CardDescription className="text-pink-600">Position yourself and strike a pose!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    className="w-full aspect-video object-cover rounded-lg border-2 border-pink-200 bg-pink-50"
                    style={{ filter: currentFilter }}
                  />

                  {countdown && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-pink-500/80 to-rose-500/80 rounded-lg backdrop-blur-sm"
                    >
                      <div className="text-8xl font-bold text-white animate-pulse drop-shadow-lg">
                        {countdown}
                      </div>
                    </motion.div>
                  )}

                  {animatePhoto && (
                    <motion.img
                      src={animatePhoto}
                      initial={{ scale: 0.8, opacity: 0, x: 0, y: 0, rotate: 0 }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        x: 200,
                        y: -100,
                        rotate: 10
                      }}
                      transition={{ duration: 0.6, type: "spring" }}
                      className="absolute w-24 rounded-lg shadow-xl border-2 border-pink-300"
                    />
                  )}
                </div>

                {/* Filter Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-pink-700">Photo Filter</Label>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {filters.map((filter) => (
                      <Button
                        key={filter.name}
                        onClick={() => setCurrentFilter(filter.value)}
                        variant={currentFilter === filter.value ? "default" : "outline"}
                        size="sm"
                        className={`whitespace-nowrap ${
                          currentFilter === filter.value
                            ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-500"
                            : "border-pink-200 text-pink-600 hover:bg-pink-50"
                        }`}
                      >
                        {filter.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      onClick={takePhotobooth}
                      disabled={takingPhotos || capturedPhotos.length >= 4}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-200/50"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      {takingPhotos ? "Taking Photo..." : `Take Photo (${capturedPhotos.length}/4)`}
                    </Button>
                    <Button
                      onClick={retake}
                      variant="outline"
                      className="border-pink-200 text-pink-600 hover:bg-pink-50"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-pink-700">Strip Title</Label>
                    <Input
                      id="title"
                      value={stripTitle}
                      onChange={(e) => setStripTitle(e.target.value)}
                      placeholder="Enter photobooth title..."
                      className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                    />
                  </div>

                  <Button
                    onClick={downloadStrip}
                    disabled={capturedPhotos.length === 0}
                    variant="outline"
                    className="w-full border-pink-300 text-pink-700 hover:bg-pink-50 hover:border-pink-400"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Magical Strip ✨
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Photo Gallery Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-pink-200 shadow-xl shadow-pink-100/50">
              <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-pink-800">
                  <Image className="w-5 h-5" />
                  Photo Gallery
                  <Badge variant="secondary" className="bg-rose-100 text-rose-700">
                    {capturedPhotos.length} photos
                  </Badge>
                </CardTitle>
                <CardDescription className="text-pink-600">Your captured memories</CardDescription>
              </CardHeader>
              <CardContent>
                {capturedPhotos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-16 h-16 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center mb-4 shadow-lg"
                    >
                      <Camera className="w-8 h-8 text-white" />
                    </motion.div>
                    <p className="text-pink-700 font-medium mb-1">No photos yet!</p>
                    <p className="text-sm text-pink-600">Take your first magical photo ✨</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {capturedPhotos.map((photo, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ delay: index * 0.1, type: "spring" }}
                        className="relative group"
                      >
                        <div className="relative overflow-hidden rounded-lg border-2 border-pink-200 shadow-lg">
                          <img
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <Button
                            onClick={() => deletePhoto(index)}
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-all shadow-lg bg-red-500 hover:bg-red-600"
                          >
                            ×
                          </Button>
                          <div className="absolute bottom-2 left-2 bg-pink-500/90 text-white text-xs px-2 py-1 rounded-full">
                            #{index + 1}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}