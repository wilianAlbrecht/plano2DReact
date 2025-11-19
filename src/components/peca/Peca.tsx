// src/components/Peca/Peca.tsx
import React from "react";
import { useDrag } from "react-dnd";

interface PecaProps {
  id: string;
  nome: string;
  largura: number;
  altura: number;
}

export function Peca({ id, nome, largura, altura }: PecaProps) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "PECA",
    item: { id, nome, largura, altura, origem: "SIDEBAR" },
    collect: (m) => ({ isDragging: m.isDragging() }),
  }));

  return (
    <div
      ref={(el) => { if (el) dragRef(el); }}
      style={{
        border: "1px solid #333",
        padding: 8,
        marginBottom: 6,
        cursor: "grab",
        opacity: isDragging ? 0.5 : 1,
        background: "#fff",
      }}
    >
      <div style={{ fontWeight: 600 }}>{nome}</div>
      <div style={{ fontSize: 12 }}>{largura}px × {altura}px</div>
    </div>
  );
}
