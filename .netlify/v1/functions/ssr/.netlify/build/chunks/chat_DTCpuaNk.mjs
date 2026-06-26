import OpenAI from 'openai';

const prerender = false;
const openai = new OpenAI({
  apiKey: "sk-90656cb337ca4c6e9924148bf78d033c",
  baseURL: "https://api.deepseek.com"
  // <--- ¡La URL correcta!
});
const INSTRUCCIONES_SISTEMA = `
Eres el asistente virtual de REAXSOL, una empresa mexicana de resinas y productos químicos.
Tu objetivo es responder preguntas de manera amable, clara y útil.

Información clave que debes conocer:
- **Horario de atención**: Lunes a viernes de 9:00 a 18:00 hrs, sábados de 9:00 a 14:00 hrs.
- **Teléfono**: 55 5715 1454 y 55 5715 1579.
- **WhatsApp**: 55 5715 1454 (solo mensajes).
- **Correo electrónico**: servicios@reaxsol.com.
- **Dirección**: Vicente Guerrero No. 20, Col. Urbana Ixhuatepec, Ecatepec, Estado de México, CP 55349.
- **Productos**: Vendemos resinas de poliéster, catalizadores (peróxido de MEK), fibras de vidrio, kits reparadores, pigmentos y accesorios.
- **Envíos**: Realizamos envíos a toda la República Mexicana.

Si no sabes la respuesta a una pregunta, indícalo amablemente y sugiere contactar por teléfono o correo.
`;
async function POST({ request }) {
  try {
    const body = await request.json();
    const preguntaUsuario = body.pregunta;
    if (!preguntaUsuario) {
      return new Response(
        JSON.stringify({ error: "No se recibió ninguna pregunta." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const respuestaOpenAI = await openai.chat.completions.create({
      model: "deepseek-chat",
      // Modelo estándar de DeepSeek
      messages: [
        { role: "system", content: INSTRUCCIONES_SISTEMA },
        { role: "user", content: preguntaUsuario }
      ],
      temperature: 0.7,
      // Creatividad controlada
      max_tokens: 500
      // Respuestas concisas
    });
    const textoRespuesta = respuestaOpenAI.choices[0]?.message?.content || "No pude procesar tu pregunta.";
    return new Response(JSON.stringify({ respuesta: textoRespuesta }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error en la API de chat:", error);
    return new Response(
      JSON.stringify({
        error: "Lo siento, hubo un error al procesar tu pregunta."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
