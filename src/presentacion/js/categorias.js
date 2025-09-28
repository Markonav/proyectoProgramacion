async function cargarLibros(categoria = "") {
  const res = await fetch(`/libros/categoria?nombre=${encodeURIComponent(categoria)}`);
  const data = await res.json();

  const grid = document.querySelector(".grid");
  grid.innerHTML = "";

  if (data.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1 / -1; text-align:center;">No hay libros en esta categoría.</p>`;
    return;
  }

  data.forEach(libro => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="thumb" style="background-image:url('${libro.portada}'); background-size:cover;"></div>
      <div class="meta">
        <div class="book-title">${libro.titulo}</div>
        <div class="book-author">${libro.autor}</div>
        <div class="book-price">$${libro.precio.toLocaleString()}</div>
        <div class="cta-row">
          <button class="btn">Agregar</button>
          <button class="icon-btn" aria-label="Favorito">♡</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Cuando se hace clic en un botón de categoría
document.querySelectorAll(".cat-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    cargarLibros(btn.textContent.trim());
  });
});

// Cargar todos los libros por defecto al entrar
cargarLibros();