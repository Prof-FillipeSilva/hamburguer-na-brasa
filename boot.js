const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const cwd = __dirname;
const nodeModulesPath = path.join(cwd, "node_modules");

console.log("=== SCRIPT DE BOOT ===");
console.log("Diretório atual:", cwd);

// 1. Instalar dependências se node_modules não existir
if (!fs.existsSync(nodeModulesPath)) {
  console.log("A pasta node_modules não foi encontrada. Iniciando instalação...");
  try {
    // Usando npx nativo do node para rodar o npm garantidamente
    execSync("npx npm install", { cwd, stdio: "inherit" });
    console.log("Instalação concluída com sucesso!");
  } catch (error) {
    console.error("Falha ao instalar dependências:", error.message);
    process.exit(1);
  }
} else {
  console.log("node_modules encontrada. Pulando instalação.");
}

// 2. Iniciar o servidor Next.js
console.log("Iniciando servidor de desenvolvimento Next.js...");
try {
  execSync("npx next dev", { cwd, stdio: "inherit" });
} catch (error) {
  console.error("O servidor falhou ou foi encerrado:", error.message);
  process.exit(1);
}
