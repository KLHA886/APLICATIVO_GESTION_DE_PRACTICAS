// ------------------ DATOS INICIALES ------------------
let asignaciones = JSON.parse(localStorage.getItem('asignaciones')) || [
  { id: 1, estudiante: 'Ana Pérez', empresa: 'Laboratorios ABC', tutor: 'Ing. Ruiz', inicio: '2025-05-01', fin: '2025-07-30', estado: 'En curso' },
  { id: 2, estudiante: 'Luis Torres', empresa: 'Industrias Tech', tutor: 'Ing. Morales', inicio: '2025-04-15', fin: '2025-07-15', estado: 'En curso' }
];
let nextId = asignaciones.length ? Math.max(...asignaciones.map(a => a.id)) + 1 : 1;

const estudiantes = ['Ana Pérez', 'Luis Torres', 'María González'];
const empresas = ['Laboratorios ABC', 'Industrias Tech', 'Comercial Del Pacífico'];

// ------------------ ELEMENTOS DEL DOM ------------------
const tbody = document.querySelector('tbody');
const search = document.getElementById('search');
const modal = document.getElementById('modal');
const form = document.getElementById('formAsignacion');
const closeModal = document.querySelector('.close');

// ------------------ FUNCIONES ------------------
const guardarDatos = () => localStorage.setItem('asignaciones', JSON.stringify(asignaciones));

function cargarOpciones() {
  const selEst = document.getElementById('estudiante');
  const selEmp = document.getElementById('empresa');
  selEst.innerHTML = `<option value="">Seleccione...</option>` + estudiantes.map(v => `<option>${v}</option>`).join('');
  selEmp.innerHTML = `<option value="">Seleccione...</option>` + empresas.map(v => `<option>${v}</option>`).join('');
}

function render(lista = asignaciones) {
  tbody.innerHTML = lista.length
    ? lista.map(a => `
        <tr>
          <td>${a.estudiante}</td>
          <td>${a.empresa}</td>
          <td>${a.tutor}</td>
          <td>${a.inicio}</td>
          <td>${a.fin}</td>
          <td><span class="badge ${getEstadoClass(a.estado)}">${a.estado}</span></td>
          <td>
            <button onclick="editar(${a.id})" class="btn-edit">Editar</button>
            <button onclick="eliminar(${a.id})" class="btn-delete">Eliminar</button>
          </td>
        </tr>`).join('')
    : '<tr><td colspan="7" style="text-align:center;">No se encontraron asignaciones</td></tr>';
  guardarDatos();
}

const getEstadoClass = e => ({
  'En curso': 'badge-success',
  'Finalizada': 'badge-info',
  'Pendiente': 'badge-warning'
}[e] || '');

// ------------------ EVENTOS ------------------
document.getElementById('btnNuevo').onclick = () => {
  form.reset();
  delete form.dataset.id;
  document.getElementById('modalTitle').textContent = 'Nueva Asignación';
  modal.style.display = 'block';
};
closeModal.onclick = () => modal.style.display = 'none';
window.onclick = e => e.target === modal && (modal.style.display = 'none');
form.addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const { estudiante, empresa, tutor, inicio, fin, estado } = data;
  if (!estudiante || !empresa || !tutor || !inicio || !fin || !estado)
    return alert('⚠️ Todos los campos son obligatorios.');
  if (new Date(fin) < new Date(inicio))
    return alert('❌ La fecha de fin no puede ser anterior a la fecha de inicio.');
  const id = form.dataset.id;
  const duplicada = asignaciones.some(a => a.estudiante === estudiante && a.empresa === empresa && a.id != id);
  if (duplicada) return alert('⚠️ Ya existe una asignación igual.');
  if (id) {
    Object.assign(asignaciones.find(a => a.id == id), data);
    alert('✅ Asignación actualizada correctamente');
  } else {
    asignaciones.push({ id: nextId++, ...data });
    alert('✅ Asignación creada correctamente');
  }
  form.reset();
  modal.style.display = 'none';
  render();
});
window.editar = id => {
  const a = asignaciones.find(x => x.id === id);
  if (!a) return;
  Object.keys(a).forEach(k => form[k] && (form[k].value = a[k]));
  form.dataset.id = id;
  document.getElementById('modalTitle').textContent = 'Editar Asignación';
  modal.style.display = 'block';
};
window.eliminar = id => {
  if (confirm('¿Está seguro de eliminar esta asignación?')) {
    asignaciones = asignaciones.filter(a => a.id !== id);
    render();
    alert('🗑️ Asignación eliminada correctamente');
  }
};
search.addEventListener('input', () => {
  const filtro = search.value.toLowerCase();
  render(asignaciones.filter(a =>
    Object.values(a).some(v => String(v).toLowerCase().includes(filtro))
  ));
});
// ------------------ INICIO ------------------
cargarOpciones();
render();
