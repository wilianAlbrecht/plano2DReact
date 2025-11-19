import React, { useRef } from "react";
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
  const elemRef = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "PECA_ALOCADA",
    // begin captura o offset do mouse relativo à peça já no plano
    item: (monitor : any) => {
      const client = monitor.getClientOffset();
      const rect = elemRef.current?.getBoundingClientRect();
      const offsetX = client && rect ? client.x - rect.left : 0;
      const offsetY = client && rect ? client.y - rect.top : 0;

      return { instanciaId, origem: "PLANO", offsetX, offsetY };
    },
    collect: (m) => ({ isDragging: m.isDragging() }),
  }));

  return (
    <div
      ref={(el) => {
        elemRef.current = el;
        if (el) dragRef(el);
      }}
      className="peca-wrapper-plano"
      style={{
        left: x,
        top: y,
        width: largura,
        height: altura
      }}
    >
      <div
        className={`peca-plano ${piscando ? "piscando" : ""} ${isDragging ? "dragging" : ""
          }`}
      />
    </div>
  );
}
