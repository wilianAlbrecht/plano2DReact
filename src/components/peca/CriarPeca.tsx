// src/components/Peca/CriarPeca.tsx
import React, { useState } from "react";
import "./CriarPeca.css";
import { useTranslation } from "react-i18next";

interface CriarPecaProps {
  onCriar: (peca: { id: string; nome: string; largura: number; altura: number }) => void;
}

export function CriarPeca({ onCriar }: CriarPecaProps) {
  const { t } = useTranslation();

  // Armazena nome digitado pelo usuário
  const [nome, setNome] = useState("");
  // Define largura padrão inicial
  const [largura, setLargura] = useState<number>(200);
  // Define altura padrão inicial
  const [altura, setAltura] = useState<number>(120);

  // Cria nova peça com valores definidos pelo usuário
  const criar = () => {
      // Impede criação sem nome
      if (!nome) return alert(t("erroNomeVazio"));

      // Envia peça criada para componente pai
      onCriar({ id: crypto.randomUUID(), nome, largura, altura });

      // Limpa campo de nome após criar
      setNome("");
  };

  return (
    <div className="criarpeca-container">
      <h3>{t("criarPeca")}</h3>

      <input
        placeholder={t("nome")}
        value={nome}
        // Atualiza nome ao digitar
        onChange={(e) => setNome(e.target.value)}
      />

      <input
        type="number"
        placeholder={t("larguraPx")}
        value={largura}
        // Atualiza largura convertendo string para número
        onChange={(e) => setLargura(Number(e.target.value))}
      />

      <input
        type="number"
        placeholder={t("alturaPx")}
        value={altura}
        // Atualiza altura convertendo string para número
        onChange={(e) => setAltura(Number(e.target.value))}
      />

      <div className="criarpeca-actions">
        {/* Executa criação da peça */}
        <button onClick={criar}>{t("criarPeca")}</button>
      </div>
    </div>
  );
}
