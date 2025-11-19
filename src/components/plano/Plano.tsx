// src/components/Plano/Plano.tsx
import React, { useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { v4 as uuid } from "uuid";
import { PecaNoPlano } from "../peca/PecaNoPlano";
import "./Plano.css";

interface PlanoProps {
  largura: number; // px
  altura: number;  // px
}

interface PecaAlocada {
  instanciaId: string;
  modelId?: string;
  nome?: string;
  largura: number;
  altura: number;
  x: number;
  y: number;
  xAnterior?: number;
  yAnterior?: number;
  piscando?: boolean;
}

export function Plano({ largura, altura }: PlanoProps) {
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

      const pxX = offset.x - rect.left;
      const pxY = offset.y - rect.top;

      // mover peça existente
      if (dragged.instanciaId) {
        setPecas((prev) => {
          const nova = prev.map((p) =>
            p.instanciaId === dragged.instanciaId
              ? { ...p, xAnterior: p.x, yAnterior: p.y, x: pxX, y: pxY }
              : p
          );

          const atual = nova.find((p) => p.instanciaId === dragged.instanciaId);
          if (!atual) return prev;

          const bateu = nova.some(
            (other) =>
              other.instanciaId !== dragged.instanciaId && colide(atual, other)
          );

          if (bateu) {
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

      // inserir peça nova
      const modelId = dragged.id ?? dragged.modelId ?? uuid();

      setPecas((prev) => [
        ...prev,
        {
          instanciaId: uuid(),
          modelId,
          nome: dragged.nome,
          largura: dragged.largura,
          altura: dragged.altura,
          x: pxX,
          y: pxY,
        },
      ]);
    },
  }));

  const attachRefs = (el: HTMLDivElement | null) => {
    planoRef.current = el;
    dropRef(el);
  };

  return (
    <div className="plano-wrapper">
      <div
        ref={attachRefs}
        className="plano-area"
        style={{ width: largura, height: altura }}
      >
        {pecas.map((p) => (
          <PecaNoPlano key={p.instanciaId} {...p} />
        ))}
      </div>
    </div>
  );
}
