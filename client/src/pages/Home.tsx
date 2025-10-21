import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { saveWhiteboard } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Pencil,
  Square,
  Circle,
  Type,
  Eraser,
  Download,
  Trash2,
  Move,
  MousePointer2,
} from "lucide-react";

type Tool = "select" | "pen" | "rectangle" | "circle" | "text" | "eraser" | "pan";

interface Shape {
  id: string;
  type: "rectangle" | "circle" | "path" | "text";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: { x: number; y: number }[];
  text?: string;
  color: string;
  strokeWidth: number;
}

export default function Home() {
  const [tool, setTool] = useState<Tool>("select");
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply pan offset
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);

    // Draw all shapes
    shapes.forEach((shape) => {
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = shape.strokeWidth;
      ctx.fillStyle = shape.color;

      switch (shape.type) {
        case "rectangle":
          ctx.strokeRect(shape.x, shape.y, shape.width || 0, shape.height || 0);
          break;
        case "circle":
          ctx.beginPath();
          ctx.arc(shape.x, shape.y, shape.radius || 0, 0, 2 * Math.PI);
          ctx.stroke();
          break;
        case "path":
          if (shape.points && shape.points.length > 0) {
            ctx.beginPath();
            ctx.moveTo(shape.points[0].x, shape.points[0].y);
            shape.points.forEach((point) => {
              ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
          }
          break;
        case "text":
          ctx.font = "20px sans-serif";
          ctx.fillText(shape.text || "", shape.x, shape.y);
          break;
      }
    });

    // Draw current shape being created
    if (currentShape) {
      ctx.strokeStyle = currentShape.color;
      ctx.lineWidth = currentShape.strokeWidth;
      ctx.fillStyle = currentShape.color;

      switch (currentShape.type) {
        case "rectangle":
          ctx.strokeRect(
            currentShape.x,
            currentShape.y,
            currentShape.width || 0,
            currentShape.height || 0
          );
          break;
        case "circle":
          ctx.beginPath();
          ctx.arc(
            currentShape.x,
            currentShape.y,
            currentShape.radius || 0,
            0,
            2 * Math.PI
          );
          ctx.stroke();
          break;
        case "path":
          if (currentShape.points && currentShape.points.length > 0) {
            ctx.beginPath();
            ctx.moveTo(currentShape.points[0].x, currentShape.points[0].y);
            currentShape.points.forEach((point) => {
              ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
          }
          break;
      }
    }

    ctx.restore();
  }, [shapes, currentShape, panOffset]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left - panOffset.x,
      y: e.clientY - rect.top - panOffset.y,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);

    if (tool === "pan" || e.button === 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      return;
    }

    if (tool === "text") {
      const text = prompt("Enter text:");
      if (text) {
        const newShape: Shape = {
          id: Date.now().toString(),
          type: "text",
          x: pos.x,
          y: pos.y,
          text,
          color,
          strokeWidth,
        };
        setShapes([...shapes, newShape]);
      }
      return;
    }

    setIsDrawing(true);

    switch (tool) {
      case "pen":
        setCurrentShape({
          id: Date.now().toString(),
          type: "path",
          x: pos.x,
          y: pos.y,
          points: [pos],
          color,
          strokeWidth,
        });
        break;
      case "rectangle":
        setCurrentShape({
          id: Date.now().toString(),
          type: "rectangle",
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
          color,
          strokeWidth,
        });
        break;
      case "circle":
        setCurrentShape({
          id: Date.now().toString(),
          type: "circle",
          x: pos.x,
          y: pos.y,
          radius: 0,
          color,
          strokeWidth,
        });
        break;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    if (!isDrawing || !currentShape) return;

    const pos = getMousePos(e);

    switch (tool) {
      case "pen":
        setCurrentShape({
          ...currentShape,
          points: [...(currentShape.points || []), pos],
        });
        break;
      case "rectangle":
        setCurrentShape({
          ...currentShape,
          width: pos.x - currentShape.x,
          height: pos.y - currentShape.y,
        });
        break;
      case "circle":
        const radius = Math.sqrt(
          Math.pow(pos.x - currentShape.x, 2) +
            Math.pow(pos.y - currentShape.y, 2)
        );
        setCurrentShape({
          ...currentShape,
          radius,
        });
        break;
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (isDrawing && currentShape) {
      setShapes([...shapes, currentShape]);
      setCurrentShape(null);
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    setShapes([]);
    setPanOffset({ x: 0, y: 0 });
  };

  const saveToServer = async () => {
    try {
      // Example usage of vulnerable axios 0.21.1
      await saveWhiteboard({ shapes, timestamp: Date.now() });
      alert("Whiteboard saved successfully!");
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save whiteboard");
    }
  };

  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Collaborative Whiteboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={saveToServer}>
              <Download className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={exportCanvas}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={clearCanvas}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Toolbar */}
        <Card className="m-4 p-4 w-64 h-fit">
          <h2 className="font-semibold mb-4">Tools</h2>
          
          <div className="space-y-2">
            <Button
              variant={tool === "select" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setTool("select")}
            >
              <MousePointer2 className="w-4 h-4 mr-2" />
              Select
            </Button>
            <Button
              variant={tool === "pen" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setTool("pen")}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Pen
            </Button>
            <Button
              variant={tool === "rectangle" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setTool("rectangle")}
            >
              <Square className="w-4 h-4 mr-2" />
              Rectangle
            </Button>
            <Button
              variant={tool === "circle" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setTool("circle")}
            >
              <Circle className="w-4 h-4 mr-2" />
              Circle
            </Button>
            <Button
              variant={tool === "text" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setTool("text")}
            >
              <Type className="w-4 h-4 mr-2" />
              Text
            </Button>
            <Button
              variant={tool === "pan" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setTool("pan")}
            >
              <Move className="w-4 h-4 mr-2" />
              Move
            </Button>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Color</label>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    className={`w-10 h-10 rounded border-2 ${
                      color === c ? "border-blue-500" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Thickness: {strokeWidth}px
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </Card>

        {/* Canvas */}
        <div className="flex-1 p-4 overflow-hidden">
          <canvas
            ref={canvasRef}
            width={2000}
            height={1500}
            className="border border-gray-300 bg-white cursor-crosshair rounded shadow-lg"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
      </div>
    </div>
  );
}

