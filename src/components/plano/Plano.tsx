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

  // Remove instâncias de peças deletadas na sidebar
  useEffect(() => {
    if (pecasRemovidas.length === 0) return;

    setPecas((prev) =>
      prev.filter((p) => !pecasRemovidas.includes(p.modelId || ""))
    );
  }, [pecasRemovidas]);

  // Verifica colisão usando AABB
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

      // Calcula posição final da peça dentro do plano
      const pxX = mouse.x - rect.left - (dragged.offsetX ?? 0);
      const pxY = mouse.y - rect.top - (dragged.offsetY ?? 0);

      // ============================
      // MOVER PEÇA EXISTENTE
      // ============================
      if (dragged.instanciaId) {
        setPecas((prev) => {
          let antesX = 0;
          let antesY = 0;

          // Salva posição antiga e aplica nova posição
          const nova = prev.map((p) => {
            if (p.instanciaId === dragged.instanciaId) {
              antesX = p.x;
              antesY = p.y;
              return { ...p, x: pxX, y: pxY };
            }
            return p;
          });

          // Obtém peça atualizada
          const atual = nova.find((p) => p.instanciaId === dragged.instanciaId);
          if (!atual) return prev;

          // Verifica colisão com outras peças
          const bateu = nova.some(
            (o) => o.instanciaId !== atual.instanciaId && colide(atual, o)
          );

          // Reverte movimento e aplica efeito visual
          if (bateu) {
            const revertida = prev.map((p) =>
              p.instanciaId === dragged.instanciaId
                ? { ...p, x: antesX, y: antesY, piscando: true }
                : p
            );

            // Remove efeito de piscando após 1.5s
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

          // Retorna lista com movimento aplicado
          return nova;
        });

        return;
      }

      // ============================
      // INSERIR NOVA PEÇA
      // ============================
      const modelId = dragged.id ?? uuid();

      setPecas((prev) => [
        ...prev,
        {
          instanciaId: uuid(), // Gera ID único da instância
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

  // Conecta div ao mecanismo de drop
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
        {/* Renderiza todas as peças no plano */}
        {pecas.map((p) => (
          <PecaNoPlano key={p.instanciaId} {...p} />
        ))}
      </div>
    </div>
  );
}
