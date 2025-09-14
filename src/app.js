// src/app.js
import express from "express";
import { supabase } from "./config/supabaseClient.js";

const app = express();
app.use(express.json());

// Endpoint de prueba para verificar conexión
app.get("/api/ping", async (req, res) => {
  const { data, error } = await supabase.from("usuarios").select("id").limit(1);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ ok: true, data });
});

export default app;
