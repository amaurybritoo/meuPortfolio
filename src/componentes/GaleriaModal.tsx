import { useEffect, useState } from "react";

type Props = {
  item: any;
  fechar: () => void;
};

export default function GaleriaModal({ item, fechar }: Props) {
  const [zoom, setZoom] = useState(1);

 useEffect(() => {
  const original = document.body.style.overflow;

  if (item) {
    document.body.style.overflow = "hidden";
  }

  return () => {
    document.body.style.overflow = original;
  };
}, [item]);

  if (!item) return null;

  const handleZoom = (e: any) => {
    e.preventDefault();
    setZoom((prev) => Math.min(Math.max(prev + e.deltaY * -0.001, 1), 3));
  };

  return (
    <div className="galeria-overlay" onClick={fechar}>
      <div
        className="galeria-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {item.tipo === "img" ? (
          <img
            src={item.src}
            alt="preview"
            style={{ transform: `scale(${zoom})` }}
            onWheel={handleZoom}
          />
        ) : (
          <video src={item.src} controls />
        )}

        <button className="fechar-btn" onClick={fechar}>
  
</button>
      </div>
    </div>
    
  );
  
}
