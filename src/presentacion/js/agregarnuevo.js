// Mostrar/ocultar formulario en agregarnuevo.html
document.addEventListener("DOMContentLoaded", () => {
  const mostrarFormBtn = document.getElementById("mostrarFormBtn");
  const formContainer = document.getElementById("formContainer");

  if (mostrarFormBtn && formContainer) {
    mostrarFormBtn.addEventListener("click", () => {
      const hidden = formContainer.style.display === "none";
      formContainer.style.display = hidden ? "block" : "none";
      mostrarFormBtn.textContent = hidden ? "Cerrar Formulario" : "Agregar Libro";
    });
  }
});
