import { useState } from 'react'
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Plano } from "./components/plano/Plano";
import { Peca } from "./components/peca/Peca";

import './App.css'
import React from 'react';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        padding: "20px",
      }}
    >
      {/* Sidebar */}
      <div style={{ width: "200px" }}>
        <h3>Peças</h3>
        <Peca id={1} nome="Porta A" largura={600} altura={400} />
        <Peca id={2} nome="Base" largura={800} altura={300} />
      </div>

      {/* Plano */}
      <div>
        <h3>Plano</h3>
        <Plano largura={2750} altura={1840} />
      </div>
    </div>
  );
}

export default App
