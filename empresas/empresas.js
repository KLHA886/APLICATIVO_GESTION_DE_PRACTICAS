// Opcional: quita la siguiente línea si quieres que los datos persistan entre recargas
localStorage.removeItem('empresas');

let empresas = JSON.parse(localStorage.getItem('empresas')) || [
  { ruc: "1790012345001", nombre: "Textiles Andinos", contacto: "María López", telefono: "0987654321" },
  { ruc: "0998765432001", nombre: "Comercial Import", contacto: "Carlos Ruiz", telefono: "0981122334" }
];

// -------- REFERENCIAS --------
const tablaBody = document.querySelector("#tabla tbody");
const btnNuevo = document.getElementById("btnNuevo");
const modal = document.getElementById("modal");
const closeModal = document.querySelector(".close");
const form = document.getElementById("formEmpresa");
const search = document.getElementById("search");

// Referencias a los inputs del formulario
const rucInput = document.getElementById("ruc");
const nombreInput = document.getElementById("nombre");
const contactoInput = document.getElementById("contacto");
const telefonoInput = document.getElementById("telefono");

let editIndex = null;

// -------- MOSTRAR DATOS --------
function mostrarEmpresas(data = empresas) {
  tablaBody.innerHTML = "";

  if (!data.length) {
    tablaBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No se encontraron empresas</td></tr>`;
    localStorage.setItem("empresas", JSON.stringify(empresas));
    return;
  }

  data.forEach((emp, index) => {
    tablaBody.innerHTML += `
      <tr>
        <td>${emp.ruc}</td>
        <td>${emp.nombre}</td>
        <td>${emp.contacto}</td>
        <td>${emp.telefono}</td>
        <td>
          <button class="btn-edit" onclick="editarEmpresa(${index})">Editar</button>
          <button class="btn-delete" onclick="eliminarEmpresa(${index})">Eliminar</button>
        </td>
      </tr>
    `;
  });

  // Guardar siempre el estado actual
  localStorage.setItem("empresas", JSON.stringify(empresas));
}

// -------- ABRIR MODAL (NUEVA) --------
btnNuevo.addEventListener("click", () => {
  form.reset();
  editIndex = null;
  rucInput.readOnly = false;
  document.getElementById("modalTitle").textContent = "Nueva Empresa";

  // Mostrar modal (usamos clase 'show' si tu CSS la maneja)
  modal.classList.add("show");
  // fallback por si tu CSS usa display directamente:
  modal.style.display = "flex";
});

// -------- CERRAR MODAL --------
closeModal.addEventListener("click", () => {
  modal.classList.remove("show");
  modal.style.display = "none";
  form.reset();
});

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
    modal.style.display = "none";
    form.reset();
  }
});

// -------- GUARDAR / EDITAR --------
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const ruc = rucInput.value.trim();
  const nombre = nombreInput.value.trim();
  const contacto = contactoInput.value.trim();
  const telefono = telefonoInput.value.trim();

  // Validaciones básicas
  if (!/^\d{13}$/.test(ruc)) return alert("❌ El RUC debe tener exactamente 13 números.");
  if (!/^\d{10}$/.test(telefono)) return alert("❌ El teléfono debe tener exactamente 10 dígitos.");
  if (!nombre || !contacto) return alert("⚠️ Todos los campos son obligatorios.");

  const nuevaEmpresa = { ruc, nombre, contacto, telefono };

  if (editIndex === null) {
    // Crear: verificar RUC único
    if (empresas.some(e => e.ruc === ruc)) return alert("⚠️ Ya existe una empresa con ese RUC.");
    empresas.push(nuevaEmpresa);
    alert("✅ Empresa agregada correctamente.");
  } else {
    // Editar
    empresas[editIndex] = nuevaEmpresa;
    alert("✅ Empresa actualizada correctamente.");
  }

  localStorage.setItem("empresas", JSON.stringify(empresas));
  mostrarEmpresas();
  modal.classList.remove("show");
  modal.style.display = "none";
  form.reset();
  editIndex = null;
  rucInput.readOnly = false;
});

// -------- EDITAR --------
window.editarEmpresa = function(index) {
  editIndex = index;
  const e = empresas[index];
  if (!e) return alert("Empresa no encontrada.");

  document.getElementById("modalTitle").textContent = "Editar Empresa";

  rucInput.value = e.ruc;
  nombreInput.value = e.nombre;
  contactoInput.value = e.contacto;
  telefonoInput.value = e.telefono;

  rucInput.readOnly = true;
  modal.classList.add("show");
  modal.style.display = "flex";
};

// -------- ELIMINAR --------
window.eliminarEmpresa = function(index) {
  if (!confirm("¿Seguro que deseas eliminar esta empresa?")) return;
  empresas.splice(index, 1);
  localStorage.setItem("empresas", JSON.stringify(empresas));
  mostrarEmpresas();
};

// -------- BUSCAR --------
search.addEventListener("input", () => {
  let texto = search.value.toLowerCase();
  mostrarEmpresas(empresas.filter(emp =>
    emp.nombre.toLowerCase().includes(texto) ||
    emp.contacto.toLowerCase().includes(texto) ||
    emp.ruc.includes(texto)
  ));
});

// -------- INICIO --------
mostrarEmpresas();
