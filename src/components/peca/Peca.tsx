// src/components/Peca/Peca.tsx
import React from "react";
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

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "PECA",
    item: { id, nome, largura, altura, origem: "SIDEBAR" },
    collect: (m) => ({ isDragging: m.isDragging() }),
  }));

  return (
    <div
      ref={(el) => { if (el) dragRef(el); }}
      className={`peca-wrapper ${isDragging ? "peca-dragging" : ""}`}
    >
      <div className="peca-title">{nome}</div>

      <div className="peca-size">
        {t("dimensaoPx", { largura, altura })}
      </div>
    </div>
  );
}
