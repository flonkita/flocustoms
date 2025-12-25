export const prerender = false;

import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Récupère l'URL du webhook (on la définira plus tard dans un fichier .env)
    // Si tu veux tester vite fait, tu pourras coller l'URL directement ici à la place de process.env...
    const webhookUrl = import.meta.env.INSTAGRAM_WEBHOOK_URL;

    console.log("------------------------------------------------");
    console.log("📩 REÇU DU CHATBOT :", body);

    if (webhookUrl) {
      // On transfère les données vers Make/Zapier
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        console.log("✅ Envoyé au Webhook avec succès !");
        return new Response(
          JSON.stringify({ success: true, message: "Transmis au webhook" }),
          { status: 200 }
        );
      } else {
        console.error("❌ Erreur Webhook:", response.statusText);
        // On ne bloque pas le client même si le webhook échoue
        return new Response(
          JSON.stringify({ success: true, warning: "Webhook failed" }),
          { status: 200 }
        );
      }
    } else {
      console.log("⚠️ Aucune URL de Webhook configurée.");
      return new Response(
        JSON.stringify({
          success: true,
          message: "Sauvegardé localement (pas de webhook)",
        }),
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Erreur API :", error);
    return new Response(JSON.stringify({ error: "Erreur interne" }), {
      status: 500,
    });
  }
};
