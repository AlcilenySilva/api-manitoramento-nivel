import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const PORT = 3000;
const prisma = new PrismaClient();

app.use(express.json());


function formatarDataHora(data) {
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  const hora = String(data.getHours()).padStart(2, "0");
  const minuto = String(data.getMinutes()).padStart(2, "0");
  return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
}

function converterParaPorcentagem(distancia_cm, altura_total_cm = 100) {
  const altura_racao = altura_total_cm - distancia_cm;
  if (altura_racao < 0) return 0;
  if (altura_racao > altura_total_cm) return 100;
  return Math.round((altura_racao / altura_total_cm) * 100);
}
app.post("/new-silo", async (req, res) => {
  const { silo_name } = req.body;

  try {
    const newSilo = await prisma.nivel.create({
      data: {
        silo_name: silo_name,
        distancia_cm: 0,
      },
    });

    console.log("Novo silo criado:", newSilo);

    res.status(201).json({
      message: "Novo silo criado com sucesso.",
      silo_name: newSilo.silo_name,
      id: newSilo.id,
    });
  } catch (error) {
    console.error("Erro ao criar o silo:", error);
    res.status(500).json({ erro: "Erro ao criar o silo no banco de dados." });
  }
});

app.post("/sensores", async (req, res) => {
  const { distancia_mm, id } = req.body;

  try {
    const newReading = await prisma.nivel.update({
      where: { id },
      data: {
        distancia_mm: distancia_mm,
        dataHora: new Date(),
      },
    });

    console.log("Leitura salva no banco:", newReading);

    res.status(201).json({
      message: "Leitura salva com sucesso.",
      id: newReading.id,
      silo_name: newReading.silo_name,
      distancia_mm: newReading.distancia_mm,
      dataHora: formatarDataHora(new Date(newReading.dataHora)),
    });
  } catch (error) {
    console.error("Erro ao salvar os dados:", error);
    res.status(500).json({ erro: "Erro ao salvar os dados no banco de dados." });
  }
});

app.get("/", async (req, res) => {
  try {
    const leituras = await prisma.nivel.findMany();

    const horaConsulta = new Date();

    const resultadoFormatado = leituras.map((leitura) => ({
      silo_name: leitura.silo_name,
      distancia_bruta_mm: leitura.distancia_mm,
      porcentagem: `${converterParaPorcentagem(leitura.distancia_mm)}%`,
      dataRegistro: formatarDataHora(new Date(leitura.dataHora)),
      dataConsulta: formatarDataHora(horaConsulta),
    }));

    res.json(resultadoFormatado);
  } catch (error) {
    console.error("Erro ao buscar os dados:", error);
    res.status(500).json({ erro: "Erro ao buscar os dados." });
  }
});

app.listen(PORT, () => console.log(`API funcionando na porta ${PORT}`));
