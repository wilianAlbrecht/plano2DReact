// src/App.tsx
import React, { useEffect, useState } from "react";
import "./App.css";

import { useTranslation } from "react-i18next";

import { CriarPeca } from "./components/peca/CriarPeca";
import { CriarPlano } from "./components/plano/CriarPlano";
import { Peca } from "./components/peca/Peca";
import { Plano } from "./components/plano/Plano";

// Importa serviços simulados (mock)
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

  // Armazena lista de peças cadastradas
  const [pecas, setPecas] = useState<AppPeca[]>([]);
  // Armazena lista de planos cadastrados
  const [planos, setPlanos] = useState<AppPlano[]>([]);
  // Armazena plano atualmente selecionado
  const [planoSelecionado, setPlanoSelecionado] = useState<AppPlano | null>(null);

  // Armazena IDs de peças removidas para limpar instâncias no plano
  const [pecasRemovidas, setPecasRemovidas] = useState<string[]>([]);

  // ==========================
  //   CARREGAR MOCK VIA API
  // ==========================
  useEffect(() => {
    async function load() {
      // Carrega peças mockadas
      const listaP = await listarPecas();
      // Carrega planos mockados
      const listaPlan = await listarPlanos();

      // Define listas iniciais
      setPecas(listaP);
      setPlanos(listaPlan);

      // Seleciona primeiro plano automaticamente
      setPlanoSelecionado(listaPlan[0] || null);
    }
    load();
  }, []);

  // ==========================
  //   CRIAR PLANO
  // ==========================
  const handleCriarPlano = async (plano: AppPlano) => {
    // Cria plano via mock
    const novo = await criarPlano(plano);

    // Adiciona novo plano à lista
    setPlanos((prev) => [...prev, novo]);

    // Seleciona plano recém-criado
    setPlanoSelecionado(novo);
  };

  // ==========================
  //   CRIAR PEÇA
  // ==========================
  const handleCriarPeca = async (peca: AppPeca) => {
    // Cria peça via mock
    const nova = await criarPeca(peca);

    // Adiciona peça nova à lista lateral
    setPecas((prev) => [...prev, nova]);
  };

  // ==========================
  //   REMOVER PLANO
  // ==========================
  const handleRemoverPlano = async (id: string) => {
    // Remove plano via mock
    await removerPlano(id);

    // Remove plano da lista local
    const novosPlanos = planos.filter((p) => p.id !== id);

    // Atualiza lista
    setPlanos(novosPlanos);

    // Seleciona outro plano se o removido era o atual
    if (planoSelecionado?.id === id) {
      setPlanoSelecionado(novosPlanos[0] ?? null);
    }
  };

  // ==========================
  //   REMOVER PEÇA
  // ==========================
  const handleRemoverPeca = async (id: string) => {
    // Remove peça via mock
    await removerPeca(id);

    // Remove peça da lista lateral
    setPecas((prev) => prev.filter((p) => p.id !== id));

    // Registra peça removida para excluir instâncias do plano
    setPecasRemovidas((prev) => [...prev, id]);
  };

  return (
    <div className="app-wrapper">
      <div className="sidebar">

        {/* Selector de idiomas */}
        <div className="idioma-box">
          <label>{t("idioma")}</label>

          {/* Altera idioma da interface */}
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

        {/* Formulário de criação de plano */}
        <CriarPlano onCriar={handleCriarPlano} />

        {/* Lista de planos cadastrados */}
        <h3>{t("planos")}</h3>
        {planos.map((p) => (
          <div
            key={p.id}
            // Destaca plano selecionado
            className={`plano-item ${planoSelecionado?.id === p.id ? "plano-item-ativo" : ""}`}
          >
            {/* Seleciona plano ao clicar */}
            <div
              className="plano-click-area"
              onClick={() => setPlanoSelecionado(p)}
            >
              {p.nome} — {p.largura}px × {p.altura}px
            </div>

            {/* Remove plano */}
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

        {/* Formulário de criação de peça */}
        <CriarPeca onCriar={handleCriarPeca} />

        {/* Lista de peças */}
        <h3>{t("pecas")}</h3>
        {pecas.length === 0 && <p>{t("nenhumaPeca")}</p>}

        {pecas.map((p) => (
          <div key={p.id} className="peca-list-item">
            {/* Renderiza peça (arrastável) */}
            <Peca {...p} />

            {/* Botão de remoção */}
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

      {/* Área do plano selecionado */}
      <div className="plano-view">
        {planoSelecionado ? (
          <Plano
            key={planoSelecionado.id}
            largura={planoSelecionado.largura}
            altura={planoSelecionado.altura}
            pecasRemovidas={pecasRemovidas}  // envia peças removidas para limpar instâncias
          />
        ) : (
          <h2>{t("selecionePlano")}</h2>
        )}
      </div>
    </div>
  );
}

export default App;
