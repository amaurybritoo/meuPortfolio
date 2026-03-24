import { useEffect, useState } from "react";

type Props = {
  item: any;
  fechar: () => void;
};

export default function GaleriaModal({ item, fechar }: Props) {

  /* 🔥 Zoom inicial */
  const [zoom, setZoom] = useState(1.2);

  /* 🔥 posição */
  const [pos, setPos] = useState({ x: 0, y: 0 });

  /* 🔥 arrastar */
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  /* 🔥 duplo toque */
  const [lastTap, setLastTap] = useState(0);


  useEffect(() => {

    const original = document.body.style.overflow;

    if (item) {
      document.body.style.overflow = "hidden";
    } else {
      setZoom(1.2);
      setPos({ x: 0, y: 0 });
    }

    return () => {
      document.body.style.overflow = original;
    };

  }, [item]);

  if (!item) return null;


  /* ===================== */
  /* ZOOM SCROLL PC */
  /* ===================== */

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


  /* ===================== */
  /* ARRASTAR PC */
  /* ===================== */

  const handleMouseDown = (e: any) => {

    setDragging(true);

    setStart({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    });

  };

  const handleMouseMove = (e: any) => {

    if (!dragging) return;

    setPos({
      x: e.clientX - start.x,
      y: e.clientY - start.y
    });

  };

  const handleMouseUp = () => {
    setDragging(false);
  };


  /* ===================== */
  /* MOBILE TOUCH */
  /* ===================== */

  const handleTouchStart = (e: any) => {

    setDragging(true);

    setStart({
      x: e.touches[0].clientX - pos.x,
      y: e.touches[0].clientY - pos.y
    });

  };


  const handleTouchMove = (e: any) => {

    if (!dragging) return;

    setPos({
      x: e.touches[0].clientX - start.x,
      y: e.touches[0].clientY - start.y
    });

  };


  const handleTouchEnd = (e: any) => {

    setDragging(false);

    const now = Date.now();
    const delay = 300;

    if (lastTap && now - lastTap < delay) {

      const rect = e.currentTarget.getBoundingClientRect();

      const x = e.changedTouches[0].clientX - rect.left;
      const y = e.changedTouches[0].clientY - rect.top;

      if (zoom <= 1.2) {

        setZoom(2);

        setPos({
          x: -x,
          y: -y
        });

      } else {

        setZoom(1.2);
        setPos({ x: 0, y: 0 });

      }

    }

    setLastTap(now);

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


        {/* 🔥 CONTAINER */}
        <div

          style={{
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  cursor: dragging ? "grabbing" : "grab",

  width: "100%",
  height: "80vh" // 🔥 força área controlada
}}

          onWheel={handleWheel}

          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}

          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}

        >

          {/* 🔥 IMAGEM */}
          <div
            style={{
              transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})`,
              transformOrigin: "center",
              transition: dragging ? "none" : "transform 0.2s ease-out"
            }}
          >

            {item.tipo === "img" ? (

  <img
    src={item.src}
    alt="preview"
    style={{
      display: "block",
      maxWidth: "100%",
      maxHeight: "80vh",
      objectFit: "contain",
      userSelect: "none",
      pointerEvents: "none"
    }}
  />

) : (

              <video
                src={item.src}
                controls
                style={{
                  display: "block",
                  maxWidth: "100%"
                }}
              />

            )}

          </div>

        </div>


        <button className="fechar-btn" onClick={fechar}>
          Fechar
        </button>

      </div>

    </div>

  );

}