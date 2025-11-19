// src/components/Plano/Plano.tsx

import { useDrop } from "react-dnd";
import { useState, useRef } from "react";

interface PlanoProps {
  largura: number;
  altura: number;
}

interface PecaAlocada {
  id: number;
  nome: string;
  largura: number;
  altura: number;
  x: number;
  y: number;
}

export function Plano({ largura, altura }: PlanoProps) {
  const escala = 0.1;

  const [pecasAlocadas, setPecasAlocadas] = useState<PecaAlocada[]>([]);

  const divRef = useRef<HTMLDivElement | null>(null);

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "PECA",
    drop: (peca: any, monitor) => {
      const offset = monitor.getSourceClientOffset();
      if (!offset || !divRef.current) return;

      // Posição real do plano no viewport
      const rect = divRef.current.getBoundingClientRect();

      // Converte para coordenadas internas do plano
      const posX = offset.x - rect.left;
      const posY = offset.y - rect.top;

      // Salva no estado
      setPecasAlocadas((prev) => [
        ...prev,
        {
          ...peca,
          x: posX,
          y: posY,
        },
      ]);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={(el) => {
        divRef.current = el;
        dropRef(el);
      }}
      style={{
        width: largura * escala,
        height: altura * escala,
        border: "2px solid #333",
        backgroundSize: "20px 20px",
        backgroundImage:
          "linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)",
        backgroundColor: isOver ? "#cfffcf" : "#fff",
        position: "relative",
      }}
    >
      {pecasAlocadas.map((p, index) => (
        <div
          key={p.id + "-" + index}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: p.largura * escala,
            height: p.altura * escala,
            border: "2px solid blue",
            background: "rgba(0, 0, 255, 0.3)",
            boxSizing: "border-box",
          }}
        ></div>
      ))}
    </div>
  );
}
