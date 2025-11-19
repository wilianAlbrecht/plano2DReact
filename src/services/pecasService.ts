// src/services/pecasService.ts
import { mockPecas } from "../data/mockPecas";

let pecas = [...mockPecas]; // memória simulada da API

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function listarPecas() {
  await delay(300); // simula rede
  return [...pecas];
}

export async function criarPeca(peca: any) {
  await delay(300);
  pecas.push(peca);
  return peca;
}

export async function removerPeca(id: string) {
  await delay(300);
  pecas = pecas.filter((p) => p.id !== id);
  return true;
}

export async function atualizarPeca(pecaAtualizada: any) {
  await delay(300);
  pecas = pecas.map((p) =>
    p.id === pecaAtualizada.id ? pecaAtualizada : p
  );
  return pecaAtualizada;
}
