import { useEffect, useState } from "react";



type Props = {
  item: any;
  fechar: () => void;
};

const getDistance = (touches: any) => {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
};


export default function GaleriaModal({ item, fechar }: Props) {
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const original = document.body.style.overflow;

    if (item) {
      document.body.style.overflow = "hidden";
    } else {
      setZoom(1);
      setPos({ x: 0, y: 0 });
    }

    return () => {
      
      document.body.style.overflow = original;
    };
  }, [item]);

  if (!item) return null;

  const handleWheel = (e: any) => {
    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const offsetX = (mouseX - pos.x) / zoom;
    const offsetY = (mouseY - pos.y) / zoom;

    const delta = -e.deltaY * 0.001;
    const newZoom = Math.min(Math.max(zoom + delta, 1), 4);

    const newX = mouseX - offsetX * newZoom;
    const newY = mouseY - offsetY * newZoom;

    setZoom(newZoom);
    setPos({ x: newX, y: newY });
  };

  return (
    
    <div className="galeria-overlay" onClick={fechar}>
      <div
        className="galeria-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 🔥 TÍTULO */}
{item.titulo && (
  <div className="galeria-titulo">
    {item.titulo}
  </div>
)}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            touchAction: "none",
          }}
          onWheel={handleWheel}

onTouchStart={(e) => {
  if (e.touches.length === 2) {
    setDistance(getDistance(e.touches));
  }
}}

onTouchMove={(e) => {
  if (e.touches.length === 2) {
    e.preventDefault(); // 🔥 ESSENCIAL

    const newDistance = getDistance(e.touches);

    if (!distance) return;

    const scaleChange = newDistance / distance;

    setZoom((prev: number) => {
      const novoZoom = Math.min(Math.max(prev * scaleChange, 1), 4);
      return novoZoom;
    });

    setDistance(newDistance);
  }
}}
        >
          <div
            style={{
              transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})`,
              transformOrigin: "0 0",
              transition: "transform 0.1s",
            }}
          >
            {item.tipo === "img" ? (
              <img
                src={item.src}
                alt="preview"
                style={{ display: "block", maxWidth: "100%" }}
              />
            ) : (
              <video src={item.src} controls style={{ display: "block", maxWidth: "100%" }} />
            )}
          </div>
        </div>

        <button className="fechar-btn" onClick={fechar}>Fechar</button>
      </div>
    </div>
    
  );
  
  
}
