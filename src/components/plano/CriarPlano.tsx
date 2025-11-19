// src/components/Plano/CriarPlano.tsx
import React, { useState } from "react";
import "./CriarPlano.css";
import { useTranslation } from "react-i18next";

interface CriarPlanoProps {
  onCriar: (plano: { id: string; nome: string; largura: number; altura: number }) => void;
}

export function CriarPlano({ onCriar }: CriarPlanoProps) {
  const { t } = useTranslation();

  const [nome, setNome] = useState("");
  const [largura, setLargura] = useState<number>(1200);
  const [altura, setAltura] = useState<number>(800);

  const criar = () => {
    if (!nome) return alert(t("erroNomePlano"));
    onCriar({ id: crypto.randomUUID(), nome, largura, altura });
    setNome("");
  };

  return (
    <div className="criarplano-container">
      <h3>{t("criarPlano")}</h3>

      <input
        placeholder={t("nomePlano")}
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

      <div className="criarplano-actions">
        <button onClick={criar}>{t("criarPlano")}</button>
      </div>
    </div>
  );
}
