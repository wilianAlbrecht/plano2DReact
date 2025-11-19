// src/components/Plano/CriarPlano.tsx
import React, { useState } from "react";
import "./CriarPlano.css";
import { useTranslation } from "react-i18next";

interface CriarPlanoProps {
  onCriar: (plano: { id: string; nome: string; largura: number; altura: number }) => void;
}

export function CriarPlano({ onCriar }: CriarPlanoProps) {
  const { t } = useTranslation();

  // Armazena nome digitado para o plano
  const [nome, setNome] = useState("");
  // Define largura inicial padrão do plano
  const [largura, setLargura] = useState<number>(1200);
  // Define altura inicial padrão do plano
  const [altura, setAltura] = useState<number>(800);

  // Cria novo plano com os valores informados
  const criar = () => {
    // Impede criação sem nome
    if (!nome) return alert(t("erroNomePlano"));

    // Envia plano criado para o componente pai
    onCriar({ id: crypto.randomUUID(), nome, largura, altura });

    // Limpa campo de nome para nova criação
    setNome("");
  };

  return (
    <div className="criarplano-container">
      <h3>{t("criarPlano")}</h3>

      <input
        placeholder={t("nomePlano")}
        value={nome}
        // Atualiza nome ao digitar
        onChange={(e) => setNome(e.target.value)}
      />

      <input
        type="number"
        placeholder={t("larguraPx")}
        value={largura}
        // Converte valor digitado para número e salva como largura
        onChange={(e) => setLargura(Number(e.target.value))}
      />

      <input
        type="number"
        placeholder={t("alturaPx")}
        value={altura}
        // Converte valor digitado para número e salva como altura
        onChange={(e) => setAltura(Number(e.target.value))}
      />

      <div className="criarplano-actions">
        {/* Executa criação do plano */}
        <button onClick={criar}>{t("criarPlano")}</button>
      </div>
    </div>
  );
}
