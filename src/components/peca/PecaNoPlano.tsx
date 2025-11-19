// src/components/peca/PecaNoPlano.tsx
import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import "./PecaNoPlano.css";

interface Props {
  instanciaId: string;
  modelId?: string;
  nome?: string;
  largura: number;
  altura: number;
  x: number;
  y: number;
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

    item: (monitor) => {
      // Obtém posição do mouse
      const client = monitor.getClientOffset();

      // Obtém posição atual da peça no plano
      const rect = elemRef.current?.getBoundingClientRect();

      // Calcula deslocamento entre mouse e canto da peça
      const offsetX = client && rect ? client.x - rect.left : 0;
      const offsetY = client && rect ? client.y - rect.top : 0;

      return { instanciaId, origem: "PLANO", offsetX, offsetY };
    },

    collect: (m) => ({ isDragging: m.isDragging() }),
  }));

  return (
    <div
      ref={(el) => {
        // Conecta peça ao sistema de drag
        elemRef.current = el;
        if (el) dragRef(el);
      }}
      className="peca-wrapper-plano"
      style={{
        left: x, // Define posição horizontal da peça
        top: y,  // Define posição vertical da peça
        width: largura,
        height: altura
      }}
    >
      <div
        className={`peca-plano ${piscando ? "piscando" : ""} ${
          isDragging ? "dragging" : ""
        }`}
      />
    </div>
  );
}
