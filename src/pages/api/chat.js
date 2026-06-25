// src/pages/api/chat.js
export const prerender = false;

import OpenAI from "openai";

// --- CONFIGURACIÓN DE OPENAI ---
// La clave API se leerá de una variable de entorno por seguridad.
const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY,
});

// --- INSTRUCCIONES PARA EL ASISTENTE ---
// Aquí defines cómo debe comportarse el bot.
const INSTRUCCIONES_SISTEMA = `
Eres el asistente virtual de REAXSOL, una empresa mexicana de resinas y productos químicos.
Tu objetivo es responder preguntas de manera amable, clara y útil.

Información clave que debes conocer:
- **Horario de atención**: Lunes a jueves de 8:30 a 18:00 hrs, viernes de 8:30 a 16:00 hrs.
- **Teléfono**: 55 5715 1454 y 55 5715 1579.
- **WhatsApp**: 55 5715 1454 (solo mensajes).
- **Correo electrónico**: servicios@reaxsol.com.
- **Dirección**: Vicente Guerrero No. 20, Col. Urbana Ixhuatepec, Ecatepec, Estado de México, CP 55349.
- **Productos**: Vendemos resinas de poliéster, catalizadores (peróxido de MEK), fibras de vidrio, kits reparadores, pigmentos y accesorios.
- **Envíos**: Realizamos envíos a toda la República Mexicana.

Si no sabes la respuesta a una pregunta, indícalo amablemente y sugiere contactar por teléfono o correo.
`;

// --- MANEJADOR DE LA SOLICITUD (EL CEREBRO) ---
export async function POST({ request }) {
  try {
    // 1. Obtener la pregunta del usuario desde el cuerpo de la solicitud
    const body = await request.json();
    const preguntaUsuario = body.pregunta;

    if (!preguntaUsuario) {
      return new Response(
        JSON.stringify({ error: "No se recibió ninguna pregunta." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 2. Llamar a la API de OpenAI (Responses API)
    const respuestaOpenAI = await openai.responses.create({
      model: "gpt-4o-mini", // El modelo a usar
      instructions: INSTRUCCIONES_SISTEMA, // Las instrucciones que definimos arriba
      input: preguntaUsuario, // La pregunta del usuario
    });

    // 3. Extraer la respuesta de OpenAI
    const textoRespuesta = respuestaOpenAI.output_text;

    // 4. Devolver la respuesta al frontend (tu sitio web)
    return new Response(JSON.stringify({ respuesta: textoRespuesta }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error en la API de chat:", error);
    return new Response(
      JSON.stringify({
        error: "Lo siento, hubo un error al procesar tu pregunta.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
