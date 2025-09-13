document.addEventListener("DOMContentLoaded", () => {
  const tags = document.querySelectorAll(".card .tag");
  const progressBar = document.querySelector("progress");
  const progressText = document.querySelector("#progress-text");

  // Definimos estados posibles
  const estados = [
    { clase: "is-info", texto: "Pendiente" },
    { clase: "is-warning", texto: "Cursando" },
    { clase: "is-success", texto: "Aprobada" },
  ];

  // Manejo de clic en tags
  tags.forEach((tag) => {
    tag.addEventListener("click", () => {
      // Encontrar el estado actual
      let currentIndex = estados.findIndex((e) =>
        tag.classList.contains(e.clase)
      );

      // Siguiente estado (circular)
      let nextIndex = (currentIndex + 1) % estados.length;

      // Actualizar clase y texto
      tag.className = "tag " + estados[nextIndex].clase;
      tag.textContent = estados[nextIndex].texto;

      // Recalcular progreso
      actualizarProgreso();
    });
  });

  function actualizarProgreso() {
    const percentage = document.querySelector("#percentage-progress");
    const total = tags.length;
    const aprobadas = Array.from(tags).filter((tag) =>
      tag.classList.contains("is-success")
    ).length;

    const porcentaje = Math.round((aprobadas / total) * 100);
    percentage.textContent = `${porcentaje}%`;
    progressBar.value = porcentaje;
    progressText.textContent = `${aprobadas} / ${total} materias aprobadas`;
  }

  // Inicializar
  actualizarProgreso();
});
