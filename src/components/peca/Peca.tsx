import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import "./Peca.css";
import { useTranslation } from "react-i18next";

interface PecaProps {
  id: string;
  nome: string;
  largura: number;
  altura: number;
}

export function Peca({ id, nome, largura, altura }: PecaProps) {
  const { t } = useTranslation();
  const elemRef = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "PECA",
    // begin permite definir dinamicamente o item do drag incluindo offsets
    item: (monitor: any) => {
      const client = monitor.getClientOffset();
      const rect = elemRef.current?.getBoundingClientRect();
      const offsetX = client && rect ? client.x - rect.left : 0;
      const offsetY = client && rect ? client.y - rect.top : 0;

      return { id, nome, largura, altura, origem: "SIDEBAR", offsetX, offsetY };
    },
    collect: (m) => ({ isDragging: m.isDragging() }),
  }));

  return (
    <div
      ref={(el) => {
        elemRef.current = el;
        if (el) dragRef(el);
      }}
      className={`peca-wrapper ${isDragging ? "peca-dragging" : ""}`}
    >
      <div className="peca-title">{nome}</div>

      <div className="peca-size">
        {t("dimensaoPx", { largura, altura })}
      </div>
    </div>
  );
}
