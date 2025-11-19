// src/components/Peca/CriarPeca.tsx
import React, { useState } from "react";
import "./CriarPeca.css";
import { useTranslation } from "react-i18next";

interface CriarPecaProps {
  onCriar: (peca: { id: string; nome: string; largura: number; altura: number }) => void;
}

export function CriarPeca({ onCriar }: CriarPecaProps) {
  const { t } = useTranslation();

  const [nome, setNome] = useState("");
  const [largura, setLargura] = useState<number>(200);
  const [altura, setAltura] = useState<number>(120);

  const criar = () => {
    if (!nome) return alert(t("erroNomeVazio"));
    onCriar({ id: crypto.randomUUID(), nome, largura, altura });
    setNome("");
  };

  return (
    <div className="criarpeca-container">
      <h3>{t("criarPeca")}</h3>

      <input
        placeholder={t("nome")}
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <input
        type="number"
        placeholder={t("larguraPx")}
        value={largura}
        onChange={(e) => setLargura(Number(e.target.value))}
      />

      <input
        type="number"
        placeholder={t("alturaPx")}
        value={altura}
        onChange={(e) => setAltura(Number(e.target.value))}
      />

      <div className="criarpeca-actions">
        <button onClick={criar}>{t("criarPeca")}</button>
      </div>
    </div>
  );
}
