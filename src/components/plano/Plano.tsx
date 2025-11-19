// src/components/Plano/Plano.tsx

import React, { useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { v4 as uuid } from "uuid";
import { PecaNoPlano } from "../peca/PecaNoPlano";

interface PlanoProps {
  largura: number; // mm
  altura: number;  // mm
}

interface PecaAlocada {
  instanciaId: string;
  modelId: number;
  nome: string;
  largura: number;
  altura: number;
  x: number;
  y: number;

  // NOVOS CAMPOS
  xAnterior?: number;
  yAnterior?: number;
  piscando?: boolean;
}

export function Plano({ largura, altura }: PlanoProps) {
  const escala = 0.1;
  const planoRef = useRef<HTMLDivElement | null>(null);

  const [pecas, setPecas] = useState<PecaAlocada[]>([]);

  function colide(a: PecaAlocada, b: PecaAlocada) {
    return !(
      a.x + a.largura <= b.x ||
      a.x >= b.x + b.largura ||
      a.y + a.altura <= b.y ||
      a.y >= b.y + b.altura
    );
  }

  const [, dropRef] = useDrop(() => ({
    accept: ["PECA", "PECA_ALOCADA"],
    drop: (_, monitor) => {
      const dragged = monitor.getItem() as any;
      const offset = monitor.getSourceClientOffset();
      if (!offset || !planoRef.current) return;

      const rect = planoRef.current.getBoundingClientRect();

      const mmX = (offset.x - rect.left) / escala;
      const mmY = (offset.y - rect.top) / escala;

      // --------------------------
      // MOVER PEÇA EXISTENTE
      // --------------------------
      if (dragged.instanciaId) {
        setPecas((prev) => {
          const nova = prev.map((p) =>
            p.instanciaId === dragged.instanciaId
              ? { ...p, xAnterior: p.x, yAnterior: p.y, x: mmX, y: mmY }
              : p
          );

          const atualizada = nova.find((p) => p.instanciaId === dragged.instanciaId);

          const bateu = nova.some(
            (other) =>
              other.instanciaId !== dragged.instanciaId &&
              colide(atualizada!, other)
          );

          if (bateu) {
            console.warn("🚫 Movimento cancelado por colisão");

            const revertida = prev.map((p) =>
              p.instanciaId === dragged.instanciaId
                ? {
                    ...p,
                    x: p.xAnterior ?? p.x,
                    y: p.yAnterior ?? p.y,
                    piscando: true,
                  }
                : p
            );

            setTimeout(() => {
              setPecas((cur) =>
                cur.map((p) =>
                  p.instanciaId === dragged.instanciaId
                    ? { ...p, piscando: false }
                    : p
                )
              );
            }, 1500);

            return revertida;
          }

          return nova;
        });

        return;
      }

      // --------------------------
      // INSERIR PEÇA NOVA
      // --------------------------
      setPecas((prev) => [
        ...prev,
        {
          instanciaId: uuid(),
          modelId: dragged.modelId,
          nome: dragged.nome,
          largura: dragged.largura,
          altura: dragged.altura,
          x: mmX,
          y: mmY,
        },
      ]);
    },
  }));

  return (
    <div
      ref={(el) => {
        planoRef.current = el;
        dropRef(el);
      }}
      style={{
        width: largura * escala,
        height: altura * escala,
        border: "2px solid #000",
        position: "relative",
        background: "#f9f9f9",
      }}
    >
      {pecas.map((p) => {
        const temColisao = pecas.some(
          (other) =>
            other.instanciaId !== p.instanciaId &&
            colide(p, other)
        );

        return (
          <PecaNoPlano
            key={p.instanciaId}
            instanciaId={p.instanciaId}
            modelId={p.modelId}
            nome={p.nome}
            largura={p.largura}
            altura={p.altura}
            x={p.x}
            y={p.y}
            escala={escala}
            temColisao={temColisao}
            piscando={p.piscando}
          />
        );
      })}
    </div>
  );
}
