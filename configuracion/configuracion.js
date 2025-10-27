const form = document.getElementById('formConfig');

// 🧠 Cargar configuración anterior al iniciar
window.addEventListener('DOMContentLoaded', () => {
  const configGuardada = JSON.parse(localStorage.getItem('configPracticas'));
  if (configGuardada) {
    document.getElementById('horas').value = configGuardada.horas;
    document.getElementById('periodo').value = configGuardada.periodo;
    document.getElementById('fechaInicio').value = configGuardada.fechaInicio;
    document.getElementById('fechaFin').value = configGuardada.fechaFin;
  }
});

// 💾 Guardar configuración nueva
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const horas = document.getElementById('horas').value;
  const periodo = document.getElementById('periodo').value;
  const fechaInicio = document.getElementById('fechaInicio').value;
  const fechaFin = document.getElementById('fechaFin').value;

  // Validación
  if (new Date(fechaFin) < new Date(fechaInicio)) {
    alert('❌ La fecha de fin no puede ser anterior a la fecha de inicio');
    return;
  }

  // Guardar en localStorage
  const config = { horas, periodo, fechaInicio, fechaFin };
  localStorage.setItem('configPracticas', JSON.stringify(config));

  alert('✅ Configuración guardada correctamente');
});
