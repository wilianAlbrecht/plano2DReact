// src/App.tsx
import React, { useState } from "react";
import "./App.css";

import { CriarPeca } from "./components/peca/CriarPeca";
import { CriarPlano } from "./components/plano/CriarPlano";
import { Peca } from "./components/peca/Peca";
import { Plano } from "./components/plano/Plano";

import { mockPecas } from "./data/mockPecas";
import { mockPlanos } from "./data/mockPlanos";

interface AppPeca {
  id: string;
  nome: string;
  largura: number;
  altura: number;
}

interface AppPlano {
  id: string;
  nome: string;
  largura: number;
  altura: number;
}

function App() {
  const [pecas, setPecas] = useState<AppPeca[]>(mockPecas);
  const [planos, setPlanos] = useState<AppPlano[]>(mockPlanos);
  const [planoSelecionado, setPlanoSelecionado] = useState<AppPlano | null>(
    mockPlanos[0] || null
  );

  return (
    <div className="app-wrapper">
      <div className="sidebar">
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
            className={`plano-item ${
              planoSelecionado?.id === p.id ? "plano-item-ativo" : ""
            }`}
            onClick={() => setPlanoSelecionado(p)}
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

      <div className="plano-view">
        {planoSelecionado ? (
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
