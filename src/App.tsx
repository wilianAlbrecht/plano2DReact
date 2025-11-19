// src/App.tsx

import { useState } from "react";
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
  // Estados já iniciam com os mocks
  const [pecas, setPecas] = useState<AppPeca[]>(mockPecas);
  const [planos, setPlanos] = useState<AppPlano[]>(mockPlanos);
  const [planoSelecionado, setPlanoSelecionado] = useState<AppPlano | null>(
    mockPlanos[0] // seleciona automaticamente o primeiro plano
  );

  return (
    <div style={{ display: "flex", padding: 20, gap: 20 }}>
      
      {/* Sidebar */}
      <div style={{ width: 260 }}>

        {/* Criar Plano */}
        <CriarPlano
          onCriar={(plano) => {
            setPlanos((prev) => [...prev, plano]);
            setPlanoSelecionado(plano);
          }}
        />

        <h3>Planos Criados</h3>
        {planos.map((p) => (
          <div
            key={p.id}
            onClick={() => setPlanoSelecionado(p)}
            style={{
              cursor: "pointer",
              padding: 5,
              border: "1px solid #ccc",
              marginBottom: 4,
              background: planoSelecionado?.id === p.id ? "#d0ffd0" : "white",
            }}
          >
            {p.nome} — {p.largura}x{p.altura}
          </div>
        ))}

        <hr />

        {/* Criar Peça */}
        <CriarPeca
          onCriar={(peca) => setPecas((prev) => [...prev, peca])}
        />

        <h3>Peças Disponíveis</h3>
        {pecas.map((p) => (
          <Peca key={p.id} {...p} />
        ))}
      </div>

      {/* Plano */}
      <div style={{ flex: 1 }}>
        {planoSelecionado ? (
          <Plano
            key={planoSelecionado.id} // reset das peças ao trocar de plano
            largura={planoSelecionado.largura}
            altura={planoSelecionado.altura}
          />
        ) : (
          <h2>Nenhum plano selecionado</h2>
        )}
      </div>
    </div>
  );
}

export default App;
