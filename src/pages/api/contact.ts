import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    if (!body?.email || !body?.nombre || !body?.mensaje) {
      return new Response(
        JSON.stringify({ success: false, message: "Faltan campos obligatorios" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // TODO: Integrar con el proveedor de correo o CRM oficial de Devint.

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "No se pudo procesar el formulario" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
