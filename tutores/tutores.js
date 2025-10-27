// ------------------ DATOS INICIALES ------------------
let tutores = JSON.parse(localStorage.getItem('tutores')) || [
  { cedula: '0912345678', nombre: 'Ing. Ruiz', especialidad: 'Redes', correo: 'ruiz@uleam.edu.ec' },
  { cedula: '0923456789', nombre: 'Ing. Morales', especialidad: 'Software', correo: 'morales@uleam.edu.ec' },
  { cedula: '0934567890', nombre: 'Lic. Pérez', especialidad: 'Administración', correo: 'perez@uleam.edu.ec' }
];

// ------------------ ELEMENTOS DEL DOM ------------------
const tbody = document.querySelector('tbody');
const search = document.getElementById('search');
const modal = document.getElementById('modal');
const form = document.getElementById('formTutor');
const closeModal = document.querySelector('.close');
const btnNuevo = document.getElementById('btnNuevo');

// ------------------ FUNCIONES ------------------
const guardar = () => localStorage.setItem('tutores', JSON.stringify(tutores));

function render(lista = tutores) {
  tbody.innerHTML = lista.length
    ? lista.map(t => `
      <tr>
        <td>${t.cedula}</td>
        <td>${t.nombre}</td>
        <td>${t.especialidad}</td>
        <td>${t.correo}</td>
        <td>
          <button onclick="editar('${t.cedula}')" class="btn-edit">Editar</button>
          <button onclick="eliminar('${t.cedula}')" class="btn-delete">Eliminar</button>
        </td>
      </tr>`).join('')
    : `<tr><td colspan="5" style="text-align:center;">No se encontraron tutores</td></tr>`;
  guardar();
}

// ------------------ EVENTOS ------------------
btnNuevo.onclick = () => {
  form.reset();
  form.cedula.readOnly = false;
  delete form.dataset.cedula;
  document.getElementById('modalTitle').textContent = 'Nuevo Tutor';
  modal.style.display = 'block';
};

form.addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  if (!Object.values(data).every(v => v.trim())) return alert('⚠️ Todos los campos son obligatorios');
  if (!/^\d{10}$/.test(data.cedula)) return alert('❌ La cédula debe tener 10 números');
  if (!/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(data.correo)) return alert('❌ Correo inválido');

  const index = tutores.findIndex(t => t.cedula === data.cedula);
  if (index === -1) {
    tutores.push(data);
    alert('✅ Tutor agregado correctamente');
  } else {
    tutores[index] = data;
    alert('✅ Tutor actualizado correctamente');
  }

  modal.style.display = 'none';
  form.reset();
  render();
});

window.editar = cedula => {
  const t = tutores.find(x => x.cedula === cedula);
  if (!t) return;
  Object.keys(t).forEach(k => form[k].value = t[k]);
  form.cedula.readOnly = true;
  form.dataset.cedula = cedula;
  document.getElementById('modalTitle').textContent = 'Editar Tutor';
  modal.style.display = 'block';
};

window.eliminar = cedula => {
  if (confirm('¿Eliminar este tutor?')) {
    tutores = tutores.filter(t => t.cedula !== cedula);
    render();
    alert('🗑️ Tutor eliminado correctamente');
  }
};

search.addEventListener('input', () => {
  const f = search.value.toLowerCase();
  render(tutores.filter(t =>
    t.nombre.toLowerCase().includes(f) ||
    t.cedula.includes(f) ||
    t.especialidad.toLowerCase().includes(f)
  ));
});

closeModal.onclick = () => modal.style.display = 'none';
window.onclick = e => e.target === modal && (modal.style.display = 'none');

// ------------------ INICIO ------------------
render();
