// Opcional: quita la siguiente línea si quieres que los datos persistan entre recargas
localStorage.removeItem('estudiantes');

let estudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [
  { cedula: '0101010101', nombre: 'Ana Pérez', carrera: 'Sistemas', email: 'ana@uleam.edu' },
  { cedula: '0202020202', nombre: 'Luis Torres', carrera: 'Contabilidad', email: 'luis@uleam.edu' },
  { cedula: '1303030303', nombre: 'María González', carrera: 'Sistemas', email: 'maria@uleam.edu' }
];

const tbody = document.querySelector('#tabla tbody');
const search = document.getElementById('search');
const modal = document.getElementById('modal');
const form = document.getElementById('formEstudiante');
const closeModal = document.querySelector('#modal .close');
const btnNuevo = document.getElementById('btnNuevo');

const guardar = () => localStorage.setItem('estudiantes', JSON.stringify(estudiantes));

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function render(lista = estudiantes) {
  tbody.innerHTML = lista.length
    ? lista.map(e => `
      <tr>
        <td>${e.cedula}</td>
        <td>${escapeHtml(e.nombre)}</td>
        <td>${escapeHtml(e.carrera)}</td>
        <td>${escapeHtml(e.email)}</td>
        <td>
          <button onclick="editar('${e.cedula}')" class="btn-edit">Editar</button>
          <button onclick="eliminar('${e.cedula}')" class="btn-delete">Eliminar</button>
        </td>
      </tr>`).join('')
    : `<tr><td colspan="5" style="text-align:center;">No se encontraron estudiantes</td></tr>`;
  guardar();
}

// ➕ Nuevo estudiante
btnNuevo.addEventListener('click', () => {
  form.reset();
  form.cedula.readOnly = false;
  delete form.dataset.cedula;
  document.getElementById('modalTitle').textContent = 'Nuevo Estudiante';
  modal.style.display = 'block';
  setTimeout(() => form.cedula.focus(), 100);
});

// ❌ Cerrar modal
closeModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

// ✅ Guardar estudiante (crear o editar)
form.addEventListener('submit', (ev) => {
  ev.preventDefault();

  const data = Object.fromEntries(new FormData(form).entries());
  for (const k in data) data[k] = data[k].trim();

  // Validaciones
  if (!/^\d{10}$/.test(data.cedula)) return alert('❌ La cédula debe tener exactamente 10 números.');
  if (!/^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}$/.test(data.email)) return alert('❌ Email inválido');
  if (!data.nombre || !data.carrera) return alert("⚠️ Todos los campos son obligatorios.");

  // Saber si estamos editando
  const editCedula = form.dataset.cedula;

  if (editCedula) {
    // Si se intenta cambiar la cédula, verificar duplicado
    if (data.cedula !== editCedula && estudiantes.some(e => e.cedula === data.cedula)) {
      return alert("⚠️ Ya existe un estudiante con esa cédula.");
    }
    const i = estudiantes.findIndex(e => e.cedula === editCedula);
    estudiantes[i] = data;
    alert("✅ Estudiante actualizado correctamente.");
  } else {
    // Crear nuevo: verificar que no exista la cédula
    if (estudiantes.some(e => e.cedula === data.cedula)) {
      return alert("⚠️ Ya existe un estudiante con esa cédula.");
    }
    estudiantes.push(data);
    alert("✅ Estudiante agregado correctamente.");
  }

  guardar();
  render();
  modal.style.display = 'none';
  form.reset();
  form.cedula.readOnly = false;
  delete form.dataset.cedula;
});

// ✏️ Editar
window.editar = (cedula) => {
  const e = estudiantes.find(x => x.cedula === cedula);
  if (!e) return alert('❌ Estudiante no encontrado');
  Object.keys(e).forEach(k => form[k].value = e[k]);
  form.dataset.cedula = cedula;
  form.cedula.readOnly = true;
  document.getElementById('modalTitle').textContent = 'Editar Estudiante';
  modal.style.display = 'block';
};

// 🗑️ Eliminar
window.eliminar = (cedula) => {
  if (!confirm('¿Eliminar este estudiante?')) return;
  estudiantes = estudiantes.filter(e => e.cedula !== cedula);
  guardar();
  render();
  alert('🗑️ Estudiante eliminado correctamente');
};

// 🔍 Buscar
search.addEventListener('input', () => {
  const f = search.value.toLowerCase();
  render(estudiantes.filter(e =>
    e.nombre.toLowerCase().includes(f) ||
    e.cedula.includes(f) ||
    e.carrera.toLowerCase().includes(f) ||
    e.email.toLowerCase().includes(f)
  ));
});

// Mostrar tabla al inicio
render();
