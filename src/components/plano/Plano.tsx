// src/components/Plano/Plano.tsx
import React, { useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { v4 as uuid } from "uuid";
import { PecaNoPlano } from "../peca/PecaNoPlano";

interface PlanoProps {
  largura: number; // px
  altura: number;  // px
}

interface PecaAlocada {
  instanciaId: string;
  modelId?: string;
  nome?: string;
  largura: number; // px
  altura: number;  // px
  x: number; // px
  y: number; // px
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

      // posição em px dentro do plano
      const pxX = offset.x - rect.left;
      const pxY = offset.y - rect.top;

      // mover peça existente (drag vindo do plano)
      if (dragged.instanciaId) {
        setPecas((prev) => {
          const nova = prev.map((p) =>
            p.instanciaId === dragged.instanciaId
              ? { ...p, xAnterior: p.x, yAnterior: p.y, x: pxX, y: pxY }
              : p
          );

          const atualizada = nova.find((p) => p.instanciaId === dragged.instanciaId);
          if (!atualizada) return prev;

          const bateu = nova.some(
            (other) => other.instanciaId !== dragged.instanciaId && colide(atualizada, other)
          );

          if (bateu) {
            // reverte e pisca
            const revertida = prev.map((p) =>
              p.instanciaId === dragged.instanciaId
                ? { ...p, x: p.xAnterior ?? p.x, y: p.yAnterior ?? p.y, piscando: true }
                : p
            );

            // remove piscando depois de 1.5s
            setTimeout(() => {
              setPecas((cur) => cur.map((p) => (p.instanciaId === dragged.instanciaId ? { ...p, piscando: false } : p)));
            }, 1500);

            return revertida;
          }

          return nova;
        });

        return;
      }

      // inserir peça nova (drag vindo da sidebar)
      // dragged tem: { id, nome, largura, altura }
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

  function attachRefs(el: HTMLDivElement | null) {
    planoRef.current = el;
    dropRef(el);
  }

  return (
    <div>
      <div
        ref={attachRefs}
        style={{
          width: largura,
          height: altura,
          border: "2px solid #222",
          position: "relative",
          background: "#fafafa",
          boxShadow: "inset 0 0 0 1px #eee",
          overflow: "hidden",
        }}
      >
        {pecas.map((p) => (
          <PecaNoPlano
            key={p.instanciaId}
            instanciaId={p.instanciaId}
            modelId={p.modelId}
            nome={p.nome}
            largura={p.largura}
            altura={p.altura}
            x={p.x}
            y={p.y}
            piscando={p.piscando}
          />
        ))}
      </div>

      {/* debug opcional */}
      {/* <pre style={{ fontSize: 12 }}>{JSON.stringify(pecas, null, 2)}</pre> */}
    </div>
  );
}
