import venom from 'venom-bot';
import axios from 'axios';

const API_KEY = `AIzaSyCSik5mxnTZC1ES7hRt3bfPwG17NPCbVFY`;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

venom
  .create({
    session: 'eco-bot-session',
    headless: true,
  })
  .then((client) => start(client))
  .catch((error) => {
    console.log(error);
  });

function start(client) {
  client.onMessage(async (message) => {
    if (message.isGroupMsg) return;

    const pergunta = message.body;
    const resposta = await responderComGemini(pergunta);

    client
      .sendText(message.from, resposta)
      .then((result) => {
        console.log('Resposta enviada pela IA: ', result);
      })
      .catch((erro) => {
        console.error('Erro ao enviar resposta: ', erro);
      });
  });

  async function responderComGemini(pergunta) {
    try {
      const response = await axios.post(API_URL, {
        contents: [{ parts: [{ text: pergunta }] }], 
      });

      const textoGerado =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'Não entendi, pode repetir?';

      return textoGerado;
    } catch (error) {
      console.log('Erro ao chamar o Gemini:', error.response?.data || error.message);
      return 'Desculpe, estou com problemas para responder no momento.';
    }
  }
}
