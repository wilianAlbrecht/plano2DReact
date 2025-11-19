// src/components/Peca/CriarPeca.tsx
import React, { useState } from "react";
import "./CriarPeca.css";

interface CriarPecaProps {
  onCriar: (peca: { id: string; nome: string; largura: number; altura: number }) => void;
}

export function CriarPeca({ onCriar }: CriarPecaProps) {
  const [nome, setNome] = useState("");
  const [largura, setLargura] = useState<number>(200);
  const [altura, setAltura] = useState<number>(120);

  const criar = () => {
    if (!nome) return alert("Digite um nome");
    onCriar({ id: crypto.randomUUID(), nome, largura, altura });
    setNome("");
  };

  return (
    <div className="criarpeca-container">
      <h3>Criar Peça</h3>

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

      <div className="criarpeca-actions">
        <button onClick={criar}>Criar Peça</button>
      </div>
    </div>
  );
}
