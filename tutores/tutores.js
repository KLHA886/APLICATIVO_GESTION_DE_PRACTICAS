// 🟡 BORRAR DATOS VIEJOS PARA QUE SE VEAN LOS QUE TÚ PUSISTE
localStorage.removeItem('tutores');

// 🟢 DATOS INICIALES
let tutores = [
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

// ➕ Nuevo tutor
btnNuevo.onclick = () => {
  form.reset();
  form.cedula.readOnly = false;
  delete form.dataset.cedula;
  document.getElementById('modalTitle').textContent = 'Nuevo Tutor';
  modal.style.display = 'flex';
};

// ✅ Guardar o Editar Tutor
form.addEventListener('submit', e => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form).entries());
  const { cedula, nombre, especialidad, email, telefono } = data;

  // Validaciones
  if (!/^\d{10}$/.test(cedula)) return alert("❌ La cédula debe tener exactamente 10 dígitos.");
  if (!/^\d{10}$/.test(telefono)) return alert("❌ El teléfono debe tener exactamente 10 dígitos.");
  if (!nombre.trim() || !especialidad.trim() || !email.trim()) return alert("⚠️ Todos los campos son obligatorios.");
  if (!email.includes("@")) return alert("📧 El email debe contener '@'.");

  // Verificar cédula única al crear
  if (!form.dataset.cedula) {
    if (tutores.some(t => t.cedula === cedula)) return alert("⚠️ Ya existe un tutor con esa cédula.");
  }

  // Guardar
  if (form.dataset.cedula) {
    const i = tutores.findIndex(t => t.cedula === form.dataset.cedula);
    tutores[i] = data;
    alert("✅ Tutor actualizado correctamente.");
  } else {
    tutores.push(data);
    alert("✅ Tutor agregado correctamente.");
  }

  modal.style.display = "none";
  render();
  form.reset();
  delete form.dataset.cedula;
  form.cedula.readOnly = false;
});

// ✏️ Editar
window.editar = cedula => {
  const t = tutores.find(t => t.cedula === cedula);
  for (const k in t) form[k].value = t[k];
  form.cedula.readOnly = true;
  form.dataset.cedula = cedula;
  document.getElementById('modalTitle').textContent = 'Editar Tutor';
  modal.style.display = 'flex';
};

// 🗑️ Eliminar
window.eliminar = cedula => {
  if (confirm("¿Eliminar tutor?")) {
    tutores = tutores.filter(t => t.cedula !== cedula);
    render();
    alert("🗑️ Eliminado");
  }
};

// 🔍 Buscar
search.oninput = () => {
  const f = search.value.toLowerCase();
  render(tutores.filter(t =>
    t.nombre.toLowerCase().includes(f) ||
    t.cedula.includes(f) ||
    t.especialidad.toLowerCase().includes(f) ||
    t.email.toLowerCase().includes(f)
  ));
};

// ❌ Cerrar modal
closeModal.onclick = () => modal.style.display = 'none';
window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

// Mostrar al iniciar
render();
