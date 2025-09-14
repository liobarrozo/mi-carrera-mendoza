// ----------------------
// CONFIGURACIÓN DEL TEMA
// ----------------------
const theme = "dark"; // "dark" o "light"
document.documentElement.classList.remove("dark", "light");
document.documentElement.classList.add(theme);

// ----------------------
// DATOS DE EJEMPLO
// ----------------------
const materiasPorAno = [
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
];

// ----------------------
// FUNCIONES
// ----------------------
function generarMaterias() {
  const container = document.getElementById("materias-container");
  if (!container) return; // Si estamos en index.html, no hacemos nada

  let aprobadas = 0;
  let total = 0;

  materiasPorAno.forEach((ano) => {
    ano.materias.forEach((materia) => {
      total++;
      if (materia.estado === "Aprobada") aprobadas++;

      const columna = document.createElement("div");
      columna.className = "column is-one-quarter";
      columna.innerHTML = `
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">${materia.nombre}</p>
          </header>
          <div class="card-content">
            <div class="content">
              Estado: <span class="tag ${
                materia.estado === "Aprobada" ? "is-success" : "is-info"
              }">${materia.estado}</span>
            </div>
          </div>
        </div>
      `;
      container.appendChild(columna);
    });
  });

  // Actualizar barra de progreso
  const porcentaje = Math.round((aprobadas / total) * 100);
  const progressBar = document.querySelector("progress");
  const percentageText = document.getElementById("percentage-progress");
  const progressText = document.getElementById("progress-text");

  if (progressBar) progressBar.value = porcentaje;
  if (percentageText) percentageText.textContent = `${porcentaje}%`;
  if (progressText)
    progressText.textContent = `${aprobadas} / ${total} materias aprobadas`;
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", generarMaterias);
