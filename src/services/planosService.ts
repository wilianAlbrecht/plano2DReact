// src/services/planosService.ts
import { mockPlanos } from "../data/mockPlanos";

let planos = [...mockPlanos]; // memória simulada

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function listarPlanos() {
  await delay(300);
  return [...planos];
}

export async function criarPlano(plano: any) {
  await delay(300);
  planos.push(plano);
  return plano;
}

export async function removerPlano(id: string) {
  await delay(300);
  planos = planos.filter((p) => p.id !== id);
  return true;
}

export async function atualizarPlano(planoAtualizado: any) {
  await delay(300);
  planos = planos.map((p) =>
    p.id === planoAtualizado.id ? planoAtualizado : p
  );
  return planoAtualizado;
}
