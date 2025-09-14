/* main.js — universal para index.html y materias.html
   - Filtrado por año
   - Actualiza barra / porcentaje / pendientes
   - Tema manual
   - Saludo + dashboard
*/

/* -----------------------------
   CONFIG: Tema y modo de progreso
   ----------------------------- */
const theme = "light"; // "dark" o "light"
document.documentElement.classList.remove("dark", "light");
document.documentElement.classList.add(theme);

// progressMode: 'filtered' -> muestra progreso del conjunto filtrado
//               'global'   -> siempre muestra progreso total de la carrera
const progressMode = "global";

/* -----------------------------
      DATOS MOCK (reemplazá por API luego)
      ----------------------------- */
const usuario = "Lionel";
const materiasPorAnoDashboard = [
  { ano: "Primer Año", aprobadas: 5, total: 12 },
  { ano: "Segundo Año", aprobadas: 4, total: 10 },
  { ano: "Tercer Año", aprobadas: 3, total: 10 },
  { ano: "Cuarto Año", aprobadas: 0, total: 10 },
];

const materiasPorAnoDetalle = [
  {
    ano: "Primer Año",
    materias: [
      { nombre: "Matemática I", estado: "Pendiente" },
      { nombre: "Algoritmos", estado: "Aprobada" },
      { nombre: "Introducción a la Educación", estado: "Pendiente" },
      { nombre: "Lengua y Literatura", estado: "Aprobada" },
    ],
  },
  {
    ano: "Segundo Año",
    materias: [
      { nombre: "Matemática II", estado: "Pendiente" },
      { nombre: "Programación", estado: "Pendiente" },
    ],
  },
  {
    ano: "Tercer Año",
    materias: [
      { nombre: "Didáctica I", estado: "Pendiente" },
      { nombre: "Psicología Evolutiva", estado: "Aprobada" },
    ],
  },
];

/* -----------------------------
      HELPERS: UI y cálculos
      ----------------------------- */
function safeQuery(selector, parent = document) {
  return parent.querySelector(selector);
}

function actualizarProgresoUI(aprobadas, total) {
  const porcentaje = total === 0 ? 0 : Math.round((aprobadas / total) * 100);
  const progressBar = document.querySelector("progress");
  const percentageText = document.getElementById("percentage-progress");
  const progressText = document.getElementById("progress-text");
  const pendingText = document.getElementById("pending-text");

  if (progressBar) progressBar.value = porcentaje;
  if (percentageText) percentageText.textContent = `${porcentaje}%`;
  if (progressText)
    progressText.textContent = `${aprobadas} / ${total} materias aprobadas`;
  if (pendingText) pendingText.textContent = `${total - aprobadas} pendientes`;
}

/* -----------------------------
      SALUDO (solo en dashboard)
      ----------------------------- */
function mostrarSaludo() {
  const saludoEl = document.getElementById("saludo");
  if (!saludoEl) return;
  const hora = new Date().getHours();
  let saludo = "Hola";
  if (hora < 12) saludo = "Buenos días";
  else if (hora < 18) saludo = "Buenas tardes";
  else saludo = "Buenas noches";
  saludoEl.textContent = `${saludo}, ${usuario} 👋`;
}

/* -----------------------------
      DASHBOARD: mini-tarjetas por año
      ----------------------------- */
function generarTarjetasDashboard() {
  const contenedor = document.getElementById("resumen-anos");
  if (!contenedor) return;

  contenedor.innerHTML = ""; // limpiar
  materiasPorAnoDashboard.forEach((ano) => {
    const columna = document.createElement("div");
    columna.className = "column is-one-quarter";
    columna.innerHTML = `
         <div class="card">
           <header class="card-header">
             <p class="card-header-title">${ano.ano}</p>
           </header>
           <div class="card-content">
             <div class="content">
               ${ano.aprobadas} / ${ano.total} materias aprobadas
             </div>
           </div>
         </div>
       `;
    contenedor.appendChild(columna);
  });

  // actualizar progreso global (dashboard)
  const totalAprobadas = materiasPorAnoDashboard.reduce(
    (a, b) => a + b.aprobadas,
    0
  );
  const totalMaterias = materiasPorAnoDashboard.reduce(
    (a, b) => a + b.total,
    0
  );
  actualizarProgresoUI(totalAprobadas, totalMaterias);
}

/* -----------------------------
      MATERIAS: render + filtrado
      ----------------------------- */
function renderMaterias(filterAno = "todos") {
  const container = document.getElementById("materias-container");
  if (!container) return;

  container.innerHTML = ""; // limpiar

  let aprobadas = 0;
  let total = 0;

  // Recorremos los años y materias
  materiasPorAnoDetalle.forEach((grupo) => {
    const anoName = grupo.ano;
    // Si hay filtro y no coincide, saltamos agregar (pero aun así podríamos contar para global)
    const mostrarAno = filterAno === "todos" || filterAno === anoName;

    grupo.materias.forEach((materia) => {
      total += mostrarAno ? 1 : 0;
      if (mostrarAno && materia.estado === "Aprobada") aprobadas++;

      if (!mostrarAno) return; // no renderizamos si no corresponde al filtro

      // Crear tarjeta
      const columna = document.createElement("div");
      columna.className = "column is-one-quarter materia-col";
      // data-ano útil para eventuales búsquedas
      columna.dataset.ano = anoName;
      columna.innerHTML = `
           <div class="card">
             <header class="card-header">
               <p class="card-header-title">${materia.nombre}</p>
               <p class="card-header-title">${materia.nombre}</p>
             </header>
             <div class="card-content">
               <div class="content">
                 Estado:
                 <span class="tag ${
                   materia.estado === "Aprobada" ? "is-success" : "is-info"
                 } materia-tag">
                   ${materia.estado}
                 </span>
               </div>
             </div>
           </div>
         `;
      container.appendChild(columna);
    });
  });

  // Si querés que el progreso muestre siempre el total de la carrera (independiente del filtro),
  // cambialo con progressMode = 'global'. Por defecto está en 'filtered'.
  if (progressMode === "global") {
    // calcular globales
    let globalAprobadas = 0;
    let globalTotal = 0;
    materiasPorAnoDetalle.forEach((g) => {
      g.materias.forEach((m) => {
        globalTotal++;
        if (m.estado === "Aprobada") globalAprobadas++;
      });
    });
    actualizarProgresoUI(globalAprobadas, globalTotal);
  } else {
    actualizarProgresoUI(aprobadas, total);
  }

  // Añadir comportamiento a las tags (click para ciclar estado)
  attachTagClickHandlers();
}

/* -----------------------------
      TAG HANDLER: ciclar estados y recalcular
      ----------------------------- */
function attachTagClickHandlers() {
  const tags = document.querySelectorAll(".materia-tag");
  const estados = ["Pendiente", "Cursando", "Aprobada"];
  tags.forEach((tag) => {
    // evitar múltiples listeners
    if (tag.dataset.listenerAttached === "1") return;
    tag.dataset.listenerAttached = "1";

    tag.style.cursor = "pointer";
    tag.addEventListener("click", (e) => {
      const current = tag.textContent.trim();
      const i = estados.indexOf(current);
      const next = estados[(i + 1) % estados.length];
      tag.textContent = next;

      // actualizar clases visuales
      tag.classList.remove("is-info", "is-warning", "is-success");
      if (next === "Pendiente") tag.classList.add("is-info");
      else if (next === "Cursando") tag.classList.add("is-warning");
      else if (next === "Aprobada") tag.classList.add("is-success");

      // Opcional: actualizar también el estado en el array de datos MOCK
      // Buscamos la materia por nombre y la actualizamos (solo para mock)
      const card = tag.closest(".materia-col");
      const anoName = card?.dataset?.ano;
      const nombre = card
        ?.querySelector(".card-header-title")
        ?.textContent?.trim();
      if (anoName && nombre) {
        for (const g of materiasPorAnoDetalle) {
          if (g.ano === anoName) {
            const m = g.materias.find((x) => x.nombre === nombre);
            if (m) m.estado = next;
          }
        }
      }

      // Reaplicar filtro y recálculo según select actual
      const select = document.getElementById("filtro-ano");
      const val = select ? select.value : "todos";
      renderMaterias(val);
    });
  });
}

/* -----------------------------
      INICIALIZACIÓN y EVENTOS
      ----------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // dashboard
  mostrarSaludo();
  generarTarjetasDashboard();

  // materias (si estamos en esa página)
  renderMaterias("todos");

  // filtrar por año: escucha de la select
  const filtro = document.getElementById("filtro-ano");
  if (filtro) {
    filtro.addEventListener("change", (e) => {
      renderMaterias(e.target.value);
    });
  }
});
