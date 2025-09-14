// server.js
import "dotenv/config";
//dotenv.config(); // Carga el .env automáticamente desde la raíz

import app from "./src/app.js";
import { supabase } from "./src/config/supabaseClient.js";

console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log(
  "SUPABASE_ANON_KEY:",
  process.env.SUPABASE_ANON_KEY?.slice(0, 8) + "..."
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
