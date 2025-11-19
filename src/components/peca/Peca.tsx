// src/components/Peca/Peca.tsx
import React from "react";
import { useDrag } from "react-dnd";

interface PecaProps {
  id: number;        // model id
  nome: string;
  largura: number;   // mm
  altura: number;    // mm
}

export function Peca({ id, nome, largura, altura }: PecaProps) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "PECA", // vem da lista
    // item que será transmitido durante o drag
    item: { modelId: id, nome, largura, altura, origem: "SIDEBAR" },
    collect: (m) => ({ isDragging: m.isDragging() }),
  }));

  return (
    <div
      ref={(el) => { if (el) dragRef(el); }}
      style={{
        border: "1px solid #000",
        padding: "8px",
        marginBottom: "8px",
        cursor: "grab",
        opacity: isDragging ? 0.5 : 1,
        background: "#fff",
      }}
    >
      {nome} — {largura} x {altura} (mm)
    </div>
  );
}
