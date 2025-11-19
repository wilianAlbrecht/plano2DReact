// src/App.tsx
import React, { useEffect, useState } from "react";
import "./App.css";

import { useTranslation } from "react-i18next";

import { CriarPeca } from "./components/peca/CriarPeca";
import { CriarPlano } from "./components/plano/CriarPlano";
import { Peca } from "./components/peca/Peca";
import { Plano } from "./components/plano/Plano";

// Services mockados
import {
  listarPecas,
  criarPeca,
  removerPeca,
} from "./services/pecasService";

import {
  listarPlanos,
  criarPlano,
  removerPlano,
} from "./services/planosService";

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

  const [pecas, setPecas] = useState<AppPeca[]>([]);
  const [planos, setPlanos] = useState<AppPlano[]>([]);
  const [planoSelecionado, setPlanoSelecionado] = useState<AppPlano | null>(null);

  // NOVO: rastreia peças removidas para apagá-las dentro do plano
  const [pecasRemovidas, setPecasRemovidas] = useState<string[]>([]);

  // ==========================
  //   CARREGAR MOCK VIA API
  // ==========================
  useEffect(() => {
    async function load() {
      const listaP = await listarPecas();
      const listaPlan = await listarPlanos();

      setPecas(listaP);
      setPlanos(listaPlan);

      setPlanoSelecionado(listaPlan[0] || null);
    }
    load();
  }, []);

  // ==========================
  //   CRIAR PLANO
  // ==========================
  const handleCriarPlano = async (plano: AppPlano) => {
    const novo = await criarPlano(plano);
    setPlanos((prev) => [...prev, novo]);
    setPlanoSelecionado(novo);
  };

  // ==========================
  //   CRIAR PEÇA
  // ==========================
  const handleCriarPeca = async (peca: AppPeca) => {
    const nova = await criarPeca(peca);
    setPecas((prev) => [...prev, nova]);
  };

  // ==========================
  //   REMOVER PLANO
  // ==========================
  const handleRemoverPlano = async (id: string) => {
    await removerPlano(id);

    // cria a nova lista localmente primeiro
    const novosPlanos = planos.filter((p) => p.id !== id);

    // atualiza o estado com a nova lista
    setPlanos(novosPlanos);

    // se o plano removido era o selecionado, seleciona o primeiro da nova lista (ou null)
    if (planoSelecionado?.id === id) {
      setPlanoSelecionado(novosPlanos[0] ?? null);
    }
  };

  // ==========================
  //   REMOVER PEÇA
  // ==========================
  const handleRemoverPeca = async (id: string) => {
    await removerPeca(id);

    // Remove da lista lateral
    setPecas((prev) => prev.filter((p) => p.id !== id));

    // Registra peça removida para apagar instâncias no plano
    setPecasRemovidas((prev) => [...prev, id]);
  };

  return (
    <div className="app-wrapper">
      <div className="sidebar">

        {/* === SELECTOR DE IDIOMAS === */}
        <div className="idioma-box">
          <label>{t("idioma")}</label>
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
        <CriarPlano onCriar={handleCriarPlano} />

        {/* === Lista de Planos === */}
        <h3>{t("planos")}</h3>
        {planos.map((p) => (
          <div
            key={p.id}
            className={`plano-item ${planoSelecionado?.id === p.id ? "plano-item-ativo" : ""
              }`}
          >
            <div
              className="plano-click-area"
              onClick={() => setPlanoSelecionado(p)}
            >
              {p.nome} — {p.largura}px × {p.altura}px
            </div>

            <button
              className="btn-remover"
              onClick={() => handleRemoverPlano(p.id)}
              title={t("remover")}
            >
              ✖
            </button>
          </div>
        ))}

        <hr />

        {/* === Criar Peça === */}
        <CriarPeca onCriar={handleCriarPeca} />

        {/* === Lista de Peças === */}
        <h3>{t("pecas")}</h3>
        {pecas.length === 0 && <p>{t("nenhumaPeca")}</p>}

        {pecas.map((p) => (
          <div key={p.id} className="peca-list-item">
            <Peca {...p} />

            <button
              className="btn-remover"
              onClick={() => handleRemoverPeca(p.id)}
              title={t("remover")}
            >
              ✖
            </button>
          </div>
        ))}
      </div>

      {/* === Área do Plano === */}
      <div className="plano-view">
        {planoSelecionado ? (
          <Plano
            key={planoSelecionado.id}
            largura={planoSelecionado.largura}
            altura={planoSelecionado.altura}
            pecasRemovidas={pecasRemovidas}  // <--- NOVO
          />
        ) : (
          <h2>{t("selecionePlano")}</h2>
        )}
      </div>
    </div>
  );
}

export default App;
