//import express from "express";

//const app = express();
//const PORT = 3000;

//app.listen(PORT, () => console.log(`API funcionando na porta ${PORT}`));//

import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const PORT = 3000;
const prisma = new PrismaClient();

app.use(express.json());

function converterParaPorcentagem(distancia_cm, altura_total_cm = 100) {
  const altura_racao = altura_total_cm - distancia_cm;
  if (altura_racao < 0) return 0;
  if (altura_racao > altura_total_cm) return 100;
  return Math.round((altura_racao / altura_total_cm) * 100);
}

app.post("/sensores", async (req, res) => {
  const { distancia_mm, silo_id } = req.body;

  if (distancia_mm === undefined || !silo_id) {
    return res.status(400).json({ erro: "distancia_mm e silo_id são obrigatórios" });
  }

  const distancia_cm = distancia_mm / 10;
  const porcentagem = converterParaPorcentagem(distancia_cm);

  // Função para formatar a data para o padrão brasileiro
  function formatarDataHora(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, '0');
    const minuto = String(data.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
  }

  try {
    // Salva os dados no banco de dados
    const newReading = await prisma.nivel.create({
      data: {
        silo: silo_id,
        distancia_cm,
        porcentagem,
      },
    });

    console.log("Dados salvos no banco:", newReading);

    // Cria um novo objeto com os dados formatados para a resposta da API
    const responseData = {
      silo: newReading.silo,
      distancia_cm: newReading.distancia_cm,
      porcentagem: `${newReading.porcentagem}%`, // Adiciona o símbolo de %
      dataHora: formatarDataHora(newReading.dataHora), // Formata a data
    };

    // Envia o objeto formatado na resposta
    res.status(201).json(responseData);

  } catch (error) {
    console.error("Erro ao salvar os dados:", error);
    res.status(500).json({ erro: "Erro ao salvar os dados no banco de dados." });
  } finally {
    await prisma.$disconnect();
  }
});

app.listen(PORT, () => console.log(`API funcionando na porta ${PORT}`));
