let estudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [
  { cedula: '0101010101', nombre: 'Ana Pérez', carrera: 'Sistemas', email: 'ana@uleam.edu' },
  { cedula: '0202020202', nombre: 'Luis Torres', carrera: 'Contabilidad', email: 'luis@uleam.edu' },
  { cedula: '0303030303', nombre: 'María González', carrera: 'Sistemas', email: 'maria@uleam.edu' }
];
const tbody = document.querySelector('#tabla tbody');
const search = document.getElementById('search');
const modal = document.getElementById('modal');
const form = document.getElementById('formEstudiante');
const closeModal = document.querySelector('#modal .close');
const btnNuevo = document.getElementById('btnNuevo');
const btnVolver = document.getElementById('btnVolver');
const guardar = () => localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
function render(lista = estudiantes) {
  tbody.innerHTML = lista.length
    ? lista.map(e => `
      <tr>
        <td>${e.cedula}</td>
        <td>${escapeHtml(e.nombre)}</td>
        <td>${escapeHtml(e.carrera)}</td>
        <td>${escapeHtml(e.email)}</td>
        <td>
          <button onclick="window.estudiantesEditar('${e.cedula}')" class="btn-edit">Editar</button>
          <button onclick="window.estudiantesEliminar('${e.cedula}')" class="btn-delete">Eliminar</button>
        </td>
      </tr>`).join('')
    : `<tr><td colspan="5" style="text-align:center;">No se encontraron estudiantes</td></tr>`;
  guardar();
}
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
btnNuevo.addEventListener('click', () => {
  form.reset();
  form.cedula.readOnly = false;
  delete form.dataset.cedula;
  document.getElementById('modalTitle').textContent = 'Nuevo Estudiante';
  modal.style.display = 'block';
  // focus primer campo
  setTimeout(() => form.cedula.focus(), 100);
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});

// Volver al dashboard — usa ruta relativa exacta
if (btnVolver) {
  btnVolver.addEventListener('click', () => {
    // Intentamos comprobar archivo con HEAD no siempre disponible en file://,
    // por eso redirigimos directamente (asegúrate de que dashboard.html exista)
    window.location.href = '../dashboard/dashboard.html';
  });
}
// -------- FORM SUBMIT (crear/editar) --------
form.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  // trim values
  for (const k in data) data[k] = data[k].trim();
  // Validaciones
  if (!data.cedula || !data.nombre || !data.carrera || !data.email) {
    return alert('⚠️ Todos los campos son obligatorios');
  }
  // cédula: exactamente 10 dígitos numéricos
  if (!/^\d{10}$/.test(data.cedula)) {
    return alert('❌ La cédula debe tener exactamente 10 números');
  }
  // email mínimo válido (más estricto posible sin regex gigante)
  if (!/^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}$/.test(data.email)) {
    return alert('❌ Email inválido');
  }
  // Si estamos editando (dataset.cedula presente), actualizamos
  const editingCedula = form.dataset.cedula;
  const idx = estudiantes.findIndex(x => x.cedula === (editingCedula || data.cedula));
  if (editingCedula) {
    // Si cambiaste la cédula en el formulario (no debería permitirse), lo manejamos:
    if (data.cedula !== editingCedula) {
      // verificar que la nueva cédula no exista ya
      if (estudiantes.some(s => s.cedula === data.cedula)) {
        return alert('❌ Ya existe un estudiante con esa cédula');
      }
    }
    if (idx === -1) {
      return alert('❌ Error: estudiante no encontrado para editar');
    }
    estudiantes[idx] = data;
    alert('✅ Estudiante actualizado correctamente');
  } else {
    // creación: verificar duplicado por cédula
    if (estudiantes.some(s => s.cedula === data.cedula)) {
      return alert('⚠️ Ya existe un estudiante con esa cédula');
    }
    estudiantes.push(data);
    alert('✅ Estudiante agregado correctamente');
  }
  guardar();
  render();
  form.reset();
  form.cedula.readOnly = false;
  delete form.dataset.cedula;
  modal.style.display = 'none';
});

// Exponer funciones globales para botones con onclick en HTML
window.estudiantesEditar = (cedula) => {
  const e = estudiantes.find(x => x.cedula === cedula);
  if (!e) return alert('❌ Estudiante no encontrado');
  // rellenar formulario (los name coinciden con las propiedades)
  Object.keys(e).forEach(k => { if (form.elements[k]) form.elements[k].value = e[k]; });
  form.dataset.cedula = cedula;
  form.cedula.readOnly = true;
  document.getElementById('modalTitle').textContent = 'Editar Estudiante';
  modal.style.display = 'block';
};

window.estudiantesEliminar = (cedula) => {
  if (!confirm('¿Eliminar este estudiante?')) return;
  estudiantes = estudiantes.filter(e => e.cedula !== cedula);
  guardar();
  render();
  alert('🗑️ Estudiante eliminado correctamente');
};

// -------- INICIO --------
render();
