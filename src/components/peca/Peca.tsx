// src/components/Peca/Peca.tsx
import { useDrag } from "react-dnd";

interface PecaProps {
  id: number;
  nome: string;
  largura: number;
  altura: number;
}

export function Peca({ id, nome, largura, altura }: PecaProps) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "PECA",
    item: { id, nome, largura, altura },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={(el) => {
        if (el) dragRef(el);
      }}
      style={{
        border: "1px solid #000",
        padding: "8px",
        marginBottom: "8px",
        cursor: "grab",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {nome} — {largura}x{altura}
    </div>
  );
}
