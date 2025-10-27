// ------------------ DATOS INICIALES ------------------
let empresas = JSON.parse(localStorage.getItem('empresas')) || [
  { ruc: '0999999999999', nombre: 'Laboratorios ABC', contacto: 'María Gómez', telefono: '0998887777' },
  { ruc: '1790012345321', nombre: 'Industrias Tech', contacto: 'Carlos López', telefono: '0995554444' },
  { ruc: '0920123456674', nombre: 'Comercial Del Pacífico', contacto: 'Ana Martínez', telefono: '0993332222' }
];

// ------------------ ELEMENTOS ------------------
const tbody = document.querySelector('tbody');
const search = document.getElementById('search');
const modal = document.getElementById('modal');
const form = document.getElementById('formEmpresa');
const closeModal = document.querySelector('.close');
const btnNuevo = document.getElementById('btnNuevo');

// ------------------ FUNCIONES ------------------
const guardar = () => localStorage.setItem('empresas', JSON.stringify(empresas));

function render(lista = empresas) {
  tbody.innerHTML = lista.length
    ? lista.map(e => `
      <tr>
        <td>${e.ruc}</td><td>${e.nombre}</td><td>${e.contacto}</td><td>${e.telefono}</td>
        <td>
          <button onclick="editar('${e.ruc}')" class="btn-edit">Editar</button>
          <button onclick="eliminar('${e.ruc}')" class="btn-delete">Eliminar</button>
        </td>
      </tr>`).join('')
    : `<tr><td colspan="5" style="text-align:center;">No se encontraron empresas</td></tr>`;
  guardar();
}

// ------------------ EVENTOS ------------------
btnNuevo.onclick = () => {
  form.reset();
  form.ruc.readOnly = false;
  document.getElementById('modalTitle').textContent = 'Nueva Empresa';
  modal.style.display = 'block';
};

form.addEventListener('submit', ev => {
  ev.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  if (!Object.values(data).every(v => v.trim())) return alert('⚠️ Todos los campos son obligatorios');
  if (!/^\d{13}$/.test(data.ruc)) return alert('❌ El RUC debe tener 13 números');
  if (!/^\d{10}$/.test(data.telefono)) return alert('❌ Teléfono inválido');

  const index = empresas.findIndex(e => e.ruc === data.ruc);
  if (index === -1) {
    empresas.push(data);
    alert('✅ Empresa agregada correctamente');
  } else {
    empresas[index] = data;
    alert('✅ Empresa actualizada correctamente');
  }

  render();
  modal.style.display = 'none';
  form.reset();
  form.ruc.readOnly = false;
  delete form.dataset.ruc;
});

window.editar = ruc => {
  const e = empresas.find(x => x.ruc === ruc);
  if (!e) return;
  Object.keys(e).forEach(k => form[k].value = e[k]);
  form.ruc.readOnly = true;
  form.dataset.ruc = ruc;
  document.getElementById('modalTitle').textContent = 'Editar Empresa';
  modal.style.display = 'block';
};

window.eliminar = ruc => {
  if (confirm('¿Eliminar esta empresa?')) {
    empresas = empresas.filter(e => e.ruc !== ruc);
    render();
    alert('🗑️ Empresa eliminada correctamente');
  }
};

search.addEventListener('input', () => {
  const f = search.value.toLowerCase();
  render(empresas.filter(e =>
    e.nombre.toLowerCase().includes(f) ||
    e.ruc.includes(f) ||
    e.contacto.toLowerCase().includes(f)
  ));
});

closeModal.onclick = () => modal.style.display = 'none';
window.onclick = e => e.target === modal && (modal.style.display = 'none');

// ------------------ INICIO ------------------
render();
