
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



async function cargarLibrosConEstado() {
  if (!tablaLibros || !tbodyLibros) return;

  setEstado({cargando:true, vacio:false, error:false});
  tablaLibros.style.display = 'none';

  try {
    const res = await fetch('/api/libros', { method: 'GET' });
    if (!res.ok) throw new Error('HTTP ' + res.status);

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


async function submitLibro(e) {

  e?.preventDefault?.();

  if (!formLibro) return;

  const tituloEl = document.getElementById('titulo');
  const autorEl  = document.getElementById('autor');
  const precioEl = document.getElementById('precio');

  const titulo = tituloEl?.value.trim();
  const autor  = autorEl?.value.trim();
  const precio = precioEl?.value.trim();

  if (!titulo || !autor || !precio) {
    setMsg('Completa todos los campos', false);
    return;
  }

  try {
    setMsg('Guardando…', true);

    
    const payload = {
      titulo,
      autor,
      
      PrecioRenta: Number(precio)
    };

    console.log('[DEBUG] POST /api/libros payload:', payload);

    const res = await fetch('/api/libros', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });

    
    let data = {};
    try { data = await res.json(); } catch {  }

    if (!res.ok) {
      console.error('[DEBUG] POST /api/libros error:', res.status, data);
      setMsg(data?.message || `Error al guardar (HTTP ${res.status})`, false);
      return;
    }

    setMsg(data?.message || 'Libro guardado', true);
    formLibro.reset();

    
    despuesDeGuardarLibroExitoso();

  } catch (err) {
    console.error('[DEBUG] POST /api/libros exception:', err);
    setMsg('Error de conexión', false);
  }
}




function despuesDeGuardarLibroExitoso() {
  setEstado({});                       
  if (tablaLibros) tablaLibros.style.display = 'table';
  cargarLibrosConEstado();             
}


document.addEventListener('DOMContentLoaded', () => {
  if (tablaLibros) {
    cargarLibrosConEstado();
  }
  if (formLibro) {
    
    formLibro.addEventListener('submit', submitLibro);

    
    document.getElementById('btnGuardarLibro')
      ?.addEventListener('click', (e) => submitLibro(e));
  }
});


