import React, { useState } from "react";

interface CriarPecaProps {
  onCriar: (peca: {
    id: string;
    nome: string;
    largura: number;
    altura: number;
  }) => void;
}

export function CriarPeca({ onCriar }: CriarPecaProps) {
  const [nome, setNome] = useState("");
  const [largura, setLargura] = useState<number>(100);
  const [altura, setAltura] = useState<number>(100);

  const criar = () => {
    if (!nome) return alert("Digite o nome da peça");

    onCriar({
      id: crypto.randomUUID(),
      nome,
      largura,
      altura,
    });

    // limpar inputs
    setNome("");
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 16 }}>
      <h3>Criar Peça</h3>

      <input
        placeholder="Nome da peça"
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

      <button onClick={criar}>Criar</button>
    </div>
  );
}
