const express = require('express');
const router = express.Router();
const openai = require('../openai'); // Carga configuración de OpenAI

router.post('/', async (req, res) => {
  try {
    console.log("REQ.BODY:", req.body);
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'El campo "prompt" es requerido y debe ser texto.' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ answer: completion.choices[0].message.content });
  } catch (error) {
    console.error("ERROR en /chat:", error);
    res.status(500).json({ error: "Error al procesar la solicitud." });
  }
});

module.exports = router;
