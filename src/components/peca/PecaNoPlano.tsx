// src/components/Peca/PecaNoPlano.tsx
import React from "react";
import { useDrag } from "react-dnd";

// Registra animação no documento (executa apenas uma vez)
const style = document.createElement("style");
style.innerHTML = `
@keyframes blinkErro {
  0% { opacity: 1; }
  50% { opacity: 0.2; }
  100% { opacity: 1; }
}
`;
document.head.appendChild(style);

interface Props {
    instanciaId: string;
    modelId: number;
    nome: string;
    largura: number;
    altura: number;
    x: number;
    y: number;
    escala: number;
    temColisao: boolean;
    piscando?: boolean; // ← NOVO
}

export function PecaNoPlano({
    instanciaId,
    modelId,
    nome,
    largura,
    altura,
    x,
    y,
    escala,
    temColisao,
    piscando, // ← USE AQUI
}: Props) {
    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: "PECA_ALOCADA",
        item: {
            instanciaId,
            modelId,
            nome,
            largura,
            altura,
            origem: "PLANO",
        },
        collect: (m) => ({ isDragging: m.isDragging() }),
    }));

    return (
        <div
            ref={(el) => { if (el) dragRef(el); }}
            style={{
                position: "absolute",
                left: x * escala,
                top: y * escala,
                width: largura * escala,
                height: altura * escala,
                background: piscando
                    ? "rgba(255, 0, 0, 0.6)"
                    : "rgba(0, 0, 255, 0.3)",
                border: piscando ? "3px solid red" : "2px solid blue",
                cursor: "move",
                opacity: isDragging ? 0.4 : 1,
                animation: piscando
                    ? "blinkErro 0.3s ease-in-out alternate 6"
                    : "none",
            }}
        />
    );
}
