// src/App.tsx
import React, { useState } from "react";
import { CriarPeca } from "./components/peca/CriarPeca";
import { CriarPlano } from "./components/plano/CriarPlano";
import { Peca } from "./components/peca/Peca";
import { Plano } from "./components/plano/Plano";

import { mockPecas } from "./data/mockPecas";
import { mockPlanos } from "./data/mockPlanos";

interface AppPeca {
  id: string;
  nome: string;
  largura: number; // px
  altura: number;  // px
}

interface AppPlano {
  id: string;
  nome: string;
  largura: number; // px
  altura: number;  // px
}

function App() {
  const [pecas, setPecas] = useState<AppPeca[]>(mockPecas);
  const [planos, setPlanos] = useState<AppPlano[]>(mockPlanos);
  const [planoSelecionado, setPlanoSelecionado] = useState<AppPlano | null>(mockPlanos[0] || null);

  return (
    <div style={{ display: "flex", padding: 20, gap: 20 }}>
      <div style={{ width: 300 }}>
        <CriarPlano
          onCriar={(plano) => {
            setPlanos((prev) => [...prev, plano]);
            setPlanoSelecionado(plano);
          }}
        />

        <h3>Planos</h3>
        {planos.map((p) => (
          <div
            key={p.id}
            onClick={() => setPlanoSelecionado(p)}
            style={{
              cursor: "pointer",
              padding: 6,
              border: "1px solid #ddd",
              marginBottom: 6,
              background: planoSelecionado?.id === p.id ? "#e6ffee" : "#fff",
            }}
          >
            {p.nome} — {p.largura}px × {p.altura}px
          </div>
        ))}

        <hr />

        <CriarPeca
          onCriar={(peca) => {
            setPecas((prev) => [...prev, peca]);
          }}
        />

        <h3>Peças</h3>
        {pecas.length === 0 && <p>Nenhuma peça.</p>}
        {pecas.map((p) => (
          <Peca key={p.id} {...p} />
        ))}
      </div>

      <div style={{ flex: 1 }}>
        {planoSelecionado ? (
          // key faz o Plano reiniciar (limpar peças) ao trocar de plano
          <Plano
            key={planoSelecionado.id}
            largura={planoSelecionado.largura}
            altura={planoSelecionado.altura}
          />
        ) : (
          <h2>Selecione ou crie um plano</h2>
        )}
      </div>
    </div>
  );
}

export default App;
