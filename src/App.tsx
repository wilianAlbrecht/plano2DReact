// src/App.tsx
import React, { useState } from "react";
import "./App.css";

import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation();

  const [pecas, setPecas] = useState<AppPeca[]>(mockPecas);
  const [planos, setPlanos] = useState<AppPlano[]>(mockPlanos);
  const [planoSelecionado, setPlanoSelecionado] = useState<AppPlano | null>(
    mockPlanos[0] || null
  );

  return (
    <div className="app-wrapper">
      <div className="sidebar">

        {/* === SELECT DE IDIOMAS === */}
        <div className="idioma-box">
          <label>{t("idioma") || "Idioma"}</label>
          <select
            className="idioma-select"
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
          >
            <option value="pt">🇧🇷 Português</option>
            <option value="en">🇺🇸 English</option>
            <option value="zh">🇨🇳 中文</option>
            <option value="el">🇬🇷 Ελληνικά</option>
            <option value="es">🇪🇸 Español</option>
          </select>
        </div>

        {/* === Criar Plano === */}
        <CriarPlano
          onCriar={(plano) => {
            setPlanos((prev) => [...prev, plano]);
            setPlanoSelecionado(plano);
          }}
        />

        {/* === Lista de Planos === */}
        <h3>{t("planos")}</h3>
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

        {/* === Criar Peça === */}
        <CriarPeca
          onCriar={(peca) => {
            setPecas((prev) => [...prev, peca]);
          }}
        />

        {/* === Lista de Peças === */}
        <h3>{t("pecas")}</h3>
        {pecas.length === 0 && <p>{t("nenhumaPeca")}</p>}

        {pecas.map((p) => (
          <Peca key={p.id} {...p} />
        ))}
      </div>

      {/* === Área do Plano === */}
      <div className="plano-view">
        {planoSelecionado ? (
          <Plano
            key={planoSelecionado.id}
            largura={planoSelecionado.largura}
            altura={planoSelecionado.altura}
          />
        ) : (
          <h2>{t("selecionePlano")}</h2>
        )}
      </div>
    </div>
  );
}

export default App;
