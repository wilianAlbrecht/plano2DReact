import React from "react";
import { useDrag } from "react-dnd";
import "./PecaNoPlano.css";

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
      className={`peca-plano ${piscando ? "piscando" : ""} ${
        isDragging ? "dragging" : ""
      }`}
      style={{
        left: Math.round(x),
        top: Math.round(y),
        width: Math.round(largura),
        height: Math.round(altura),
      }}
      title={`${largura}px × ${altura}px`}
    ></div>
  );
}
