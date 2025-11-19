import React, { useState } from "react";

interface CriarPlanoProps {
  onCriar: (plano: {
    id: string;
    nome: string;
    largura: number;
    altura: number;
  }) => void;
}

export function CriarPlano({ onCriar }: CriarPlanoProps) {
  const [nome, setNome] = useState("");
  const [largura, setLargura] = useState(2000);
  const [altura, setAltura] = useState(1000);

  const criar = () => {
    if (!nome) return alert("Digite um nome para o plano");

    onCriar({
      id: crypto.randomUUID(),
      nome,
      largura,
      altura,
    });

    setNome("");
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 20 }}>
      <h3>Criar Plano</h3>

      <input
        placeholder="Nome do plano"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <input
        type="number"
        placeholder="Largura (mm)"
        value={largura}
        onChange={(e) => setLargura(Number(e.target.value))}
      />

      <input
        type="number"
        placeholder="Altura (mm)"
        value={altura}
        onChange={(e) => setAltura(Number(e.target.value))}
      />

      <button onClick={criar}>Criar Plano</button>
    </div>
  );
}
