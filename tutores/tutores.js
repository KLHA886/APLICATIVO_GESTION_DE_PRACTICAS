let tutores = JSON.parse(localStorage.getItem('tutores')) || [
  { cedula: '1312345678', nombre: 'Ing. Ruiz', especialidad: 'Redes', email: 'ruiz@uleam.edu.ec', telefono: '0991234567' },
  { cedula: '1323456789', nombre: 'Ing. Morales', especialidad: 'Software', email: 'morales@uleam.edu.ec', telefono: '0992345678' },
  { cedula: '1334567890', nombre: 'Lic. Pérez', especialidad: 'Administración', email: 'perez@uleam.edu.ec', telefono: '0993456789' }
];

const tbody = document.querySelector('tbody');
const search = document.getElementById('search');
const modal = document.getElementById('modal');
const form = document.getElementById('formTutor');
const closeModal = document.querySelector('.close');
const btnNuevo = document.getElementById('btnNuevo');

const guardar = () => localStorage.setItem('tutores', JSON.stringify(tutores));

function render(lista = tutores) {
  tbody.innerHTML = lista.length
    ? lista.map(t => `
      <tr>
        <td>${t.cedula}</td>
        <td>${t.nombre}</td>
        <td>${t.especialidad}</td>
        <td>${t.email}</td>
        <td>${t.telefono}</td>
        <td>
          <button onclick="editar('${t.cedula}')" class="btn-edit">Editar</button>
          <button onclick="eliminar('${t.cedula}')" class="btn-delete">Eliminar</button>
        </td>
      </tr>`).join('')
    : `<tr><td colspan="6" style="text-align:center;">No se encontraron tutores</td></tr>`;
  guardar();
}

btnNuevo.onclick = () => {
  form.reset();
  form.cedula.readOnly = false;
  delete form.dataset.cedula;
  document.getElementById('modalTitle').textContent = 'Nuevo Tutor';
  modal.style.display = 'flex';
};

form.addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  if (!/^\d{10}$/.test(data.cedula)) return alert('❌ La cédula debe tener 10 números');
  if (!/^\d{10}$/.test(data.telefono)) return alert('❌ El teléfono debe tener 10 números');

  if (form.dataset.cedula) {
    const index = tutores.findIndex(t => t.cedula === form.dataset.cedula);
    tutores[index] = data;
    alert('✅ Tutor actualizado');
  } else {
    if (tutores.some(t => t.cedula === data.cedula)) return alert('⚠️ Esa cédula ya existe');
    tutores.push(data);
    alert('✅ Tutor agregado');
  }

  modal.style.display = 'none';
  render();
});

window.editar = cedula => {
  const t = tutores.find(t => t.cedula === cedula);
  for (const k in t) form[k].value = t[k];
  form.cedula.readOnly = true;
  form.dataset.cedula = cedula;
  document.getElementById('modalTitle').textContent = 'Editar Tutor';
  modal.style.display = 'flex';
};

window.eliminar = cedula => {
  if (confirm('¿Seguro de eliminar?')) {
    tutores = tutores.filter(t => t.cedula !== cedula);
    render();
    alert('🗑️ Eliminado');
  }
};

search.oninput = () => {
  const f = search.value.toLowerCase();
  render(tutores.filter(t =>
    t.nombre.toLowerCase().includes(f) ||
    t.cedula.includes(f) ||
    t.especialidad.toLowerCase().includes(f) ||
    t.email.toLowerCase().includes(f)
  ));
};

closeModal.onclick = () => modal.style.display = 'none';
window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

render();
