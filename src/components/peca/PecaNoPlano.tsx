// src/components/Peca/PecaNoPlano.tsx
import React from "react";
import { useDrag } from "react-dnd";

// registra keyframes uma vez (se já existir, append não causará problema)
if (!document.getElementById("blinkErro-style")) {
  const style = document.createElement("style");
  style.id = "blinkErro-style";
  style.innerHTML = `
  @keyframes blinkErro {
    0% { opacity: 1; }
    50% { opacity: 0.2; }
    100% { opacity: 1; }
  }`;
  document.head.appendChild(style);
}

interface Props {
  instanciaId: string;
  modelId?: string;
  nome?: string;
  largura: number; // px
  altura: number;  // px
  x: number;       // px
  y: number;       // px
  piscando?: boolean;
}

export function PecaNoPlano({
  instanciaId,
  largura,
  altura,
  x,
  y,
  piscando,
}: Props) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "PECA_ALOCADA",
    item: { instanciaId, origem: "PLANO" },
    collect: (m) => ({ isDragging: m.isDragging() }),
  }));

  return (
    <div
      ref={(el) => { if (el) dragRef(el); }}
      style={{
        position: "absolute",
        left: Math.round(x),
        top: Math.round(y),
        width: Math.round(largura),
        height: Math.round(altura),
        background: piscando ? "rgba(255,0,0,0.6)" : "rgba(0, 110, 255, 0.18)",
        border: piscando ? "3px solid #ff3333" : "2px solid #0a56ff",
        boxSizing: "border-box",
        cursor: "move",
        opacity: isDragging ? 0.5 : 1,
        animation: piscando ? "blinkErro 0.25s ease-in-out alternate 6" : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        color: "#002244",
        userSelect: "none",
      }}
      title={`${largura}px × ${altura}px`}
    >
      {/* opcional: mostrar nome curto */}
    </div>
  );
}
