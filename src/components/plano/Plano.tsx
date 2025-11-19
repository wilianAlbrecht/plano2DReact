// src/components/plano/Plano.tsx
import React, { useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { v4 as uuid } from "uuid";
import { PecaNoPlano } from "../peca/PecaNoPlano";
import "./Plano.css";

interface PlanoProps {
  largura: number;
  altura: number;
  pecasRemovidas: string[];
}

interface PecaAlocada {
  instanciaId: string;
  modelId?: string;
  nome?: string;
  largura: number;
  altura: number;
  x: number;
  y: number;
  piscando?: boolean;
}

export function Plano({ largura, altura, pecasRemovidas }: PlanoProps) {
  const planoRef = useRef<HTMLDivElement | null>(null);
  const [pecas, setPecas] = useState<PecaAlocada[]>([]);

  // Remover peças quando removidas da sidebar
  useEffect(() => {
    if (pecasRemovidas.length === 0) return;

    setPecas((prev) =>
      prev.filter((p) => !pecasRemovidas.includes(p.modelId || ""))
    );
  }, [pecasRemovidas]);

  // Função de colisão (AABB)
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
      const mouse = monitor.getClientOffset();
      if (!mouse || !planoRef.current) return;

      const rect = planoRef.current.getBoundingClientRect();

      // Calcular posição exata com o offset correto
      const pxX = mouse.x - rect.left - (dragged.offsetX ?? 0);
      const pxY = mouse.y - rect.top - (dragged.offsetY ?? 0);

      // =========================
      // 🎯 MOVER PEÇA EXISTENTE
      // =========================
      if (dragged.instanciaId) {
        setPecas((prev) => {
          // 1. capturar posição antes de mover
          let antesX = 0;
          let antesY = 0;

          // mover peça no array
          const nova = prev.map((p) => {
            if (p.instanciaId === dragged.instanciaId) {
              antesX = p.x;
              antesY = p.y;
              return { ...p, x: pxX, y: pxY };
            }
            return p;
          });

          const atual = nova.find(
            (p) => p.instanciaId === dragged.instanciaId
          );
          if (!atual) return prev;

          // 2. detectar colisão
          const bateu = nova.some(
            (o) =>
              o.instanciaId !== atual.instanciaId && colide(atual, o)
          );

          if (bateu) {
            // 3. voltar imediatamente para a posição anterior
            const revertida = prev.map((p) =>
              p.instanciaId === dragged.instanciaId
                ? { ...p, x: antesX, y: antesY, piscando: true }
                : p
            );

            // remover piscando depois de 1.5s
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

      // =========================
      // 🎯 INSERIR PEÇA NOVA
      // =========================
      const modelId = dragged.id ?? uuid();

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

  function attachRefs(e: HTMLDivElement | null) {
    planoRef.current = e;
    dropRef(e);
  }

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
