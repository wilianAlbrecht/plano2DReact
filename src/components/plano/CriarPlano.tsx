// src/components/Plano/CriarPlano.tsx
import React, { useState } from "react";
import "./CriarPlano.css";

interface CriarPlanoProps {
  onCriar: (plano: { id: string; nome: string; largura: number; altura: number }) => void;
}

export function CriarPlano({ onCriar }: CriarPlanoProps) {
  const [nome, setNome] = useState("");
  const [largura, setLargura] = useState<number>(1200);
  const [altura, setAltura] = useState<number>(800);

  const criar = () => {
    if (!nome) return alert("Digite um nome para o plano");
    onCriar({ id: crypto.randomUUID(), nome, largura, altura });
    setNome("");
  };

  return (
    <div className="criarplano-container">
      <h3>Criar Plano</h3>

      <input
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <input
        type="number"
        placeholder="Largura (px)"
        value={largura}
        onChange={(e) => setLargura(Number(e.target.value))}
      />

      <input
        type="number"
        placeholder="Altura (px)"
        value={altura}
        onChange={(e) => setAltura(Number(e.target.value))}
      />

      <div className="criarplano-actions">
        <button onClick={criar}>Criar Plano</button>
      </div>
    </div>
  );
}
