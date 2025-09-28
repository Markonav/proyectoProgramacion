// js/libros.js
// ======================================================
// Listado y creación de libros + estados visuales (S5)
// ======================================================

/* ---------- Referencias DOM ---------- */
const tablaLibros = document.getElementById('tablaLibros');
const tbodyLibros = tablaLibros ? tablaLibros.querySelector('tbody') : null;

const estadoCarga = document.getElementById('estadoCarga');
const estadoVacio  = document.getElementById('estadoVacio');
const estadoError  = document.getElementById('estadoError');

const formLibro = document.getElementById('libroForm');
const msgEl = document.getElementById('mensaje');

function setMensaje(texto, ok = true) {
  if (!msgEl) return;
  msgEl.textContent = texto;
  msgEl.style.color = ok ? '#146c2e' : '#b00020';
}
/* ---------- Utilidades UI ---------- */
function setMsg(text, ok = true) {
  if (!msgEl) return;
  msgEl.textContent = text || '';
  msgEl.style.color = ok ? 'green' : 'red';
}

function setEstado({ cargando=false, vacio=false, error=false } = {}) {
  if (estadoCarga) estadoCarga.style.display = cargando ? 'block' : 'none';
  if (estadoVacio)  estadoVacio.style.display  = vacio     ? 'block' : 'none';
  if (estadoError)  estadoError.style.display  = error     ? 'block' : 'none';
}

/* ---------- Render tabla ---------- */
function renderLibros(data = []) {
  if (!tbodyLibros) return;

  tbodyLibros.innerHTML = data.map(l => {
    const id     = l.id ?? '';
    const titulo = l.titulo ?? '';
    const autor  = l.autor ?? '';
    const precio = (l.precio ?? l.PrecioRenta ?? '');

    return `
      <tr data-id="${id}">
        <td>${id}</td>
        <td>${titulo}</td>
        <td>${autor}</td>
        <td>${precio}</td>
        <td>
          <button type="button" class="btn-eliminar">Eliminar</button>
        </td>
      </tr>
    `;
  }).join('');
}

/* ---------- Eliminar desde la tabla (delegación) ---------- */
if (tbodyLibros) {
  tbodyLibros.addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-eliminar');
    if (!btn) return;

    const tr = e.target.closest('tr');
    const idStr = tr?.dataset?.id;
    const id = Number(idStr);

    if (!Number.isInteger(id) || id <= 0) {
      setMsg('ID inválido', false);
      return;
    }
    if (!confirm(`¿Eliminar libro ID ${id}?`)) return;

    try {
      const res = await fetch(`/api/libros/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('HTTP ' + res.status);

      // Quita la fila y actualiza estados
      tr.remove();
      setMsg('Libro eliminado', true);

      if (tbodyLibros.children.length === 0) {
        setEstado({ cargando:false, vacio:true, error:false });
        if (tablaLibros) tablaLibros.style.display = 'none';
      }
    } catch (err) {
      console.error(err);
      setMsg('No se pudo eliminar el libro', false);
      setEstado({ cargando:false, vacio:false, error:true });
    }
  });
}


/* ---------- Carga con estados ---------- */
async function cargarLibrosConEstado() {
  if (!tablaLibros || !tbodyLibros) return;

  setEstado({cargando:true, vacio:false, error:false});
  tablaLibros.style.display = 'none';

  try {
    const res = await fetch('/api/libros', { method: 'GET' });
    if (!res.ok) throw new Error('HTTP ' + res.status);

    // intenta parsear a JSON; si falla, lanza error controlado
    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error('JSON inválido');
    }

    if (!Array.isArray(data)) throw new Error('Formato no esperado');

    renderLibros(data);

    if (data.length === 0) {
      setEstado({vacio:true});
      tablaLibros.style.display = 'none';
    } else {
      setEstado({});
      tablaLibros.style.display = 'table';
    }
  } catch (e) {
    setEstado({error:true});
    tablaLibros.style.display = 'none';
  }
}

/* ---------- Submit (guardar libro) ---------- */
async function submitLibro(e) {
  e.preventDefault();
  if (!formLibro) return;

  const idEl     = document.getElementById('id');
  const tituloEl = document.getElementById('titulo');
  const autorEl  = document.getElementById('autor');
  const precioEl = document.getElementById('precio');

  const id     = idEl?.value.trim();
  const titulo = tituloEl?.value.trim();
  const autor  = autorEl?.value.trim();
  const precio = precioEl?.value.trim();

  if (!id || !titulo || !autor || !precio) {
    setMsg('Completa todos los campos', false);
    return;
  }

  try {
    setMsg('Guardando…', true);

    // Mandamos ambos nombres de campo para compatibilidad
    const payload = {
      id: Number(id),
      titulo,
      autor,
      precio: Number(precio),
      PrecioRenta: Number(precio)
    };

    const res = await fetch('/api/libros', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });

    // puede que el backend no devuelva JSON siempre
    let data = {};
    try { data = await res.json(); } catch {}

    if (!res.ok) {
      setMsg(data?.message || 'Error al guardar', false);
      return;
    }

    setMsg(data?.message || 'Libro guardado', true);
    formLibro.reset();

    // actualiza listado y estados
    despuesDeGuardarLibroExitoso();

  } catch (err) {
    setMsg('Error de conexión', false);
  }
}

/* ---------- Post-guardar ---------- */
function despuesDeGuardarLibroExitoso() {
  setEstado({});                       // oculta mensajes vacío/error
  if (tablaLibros) tablaLibros.style.display = 'table';
  cargarLibrosConEstado();             // recarga desde el servidor
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  if (tablaLibros) {
    cargarLibrosConEstado();
  }
  if (formLibro) {
    formLibro.addEventListener('submit', submitLibro);
  }
});

