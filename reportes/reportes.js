const estadoPracticas = {activas: 30, finalizadas: 10, pendientes: 5};

document.getElementById('activas').textContent = estadoPracticas.activas;
document.getElementById('finalizadas').textContent = estadoPracticas.finalizadas;
document.getElementById('pendientes').textContent = estadoPracticas.pendientes;
document.getElementById('total').textContent = estadoPracticas.activas + estadoPracticas.finalizadas + estadoPracticas.pendientes;

const ctxPie = document.getElementById('graficoPie');
new Chart(ctxPie, {
  type: 'pie',
  data: {
    labels: ['Activas', 'Finalizadas', 'Pendientes'],
    datasets: [{
      data: [estadoPracticas.activas, estadoPracticas.finalizadas, estadoPracticas.pendientes],
      backgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)'],
      borderColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
      borderWidth: 1
    }]
  },
  options: {responsive: true, plugins: {legend: {position: 'bottom'}}}
});

const ctxBarras = document.getElementById('graficoBarras');
new Chart(ctxBarras, {
  type: 'bar',
  data: {
    labels: ['Laboratorios ABC', 'Industrias Tech', 'Comercial Del Pacífico', 'TechSolutions', 'InnovaGroup'],
    datasets: [{
      label: 'Número de Prácticas',
      data: [12, 8, 7, 10, 8],
      backgroundColor: 'rgba(54, 162, 235, 0.8)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  },
  options: {responsive: true, scales: {y: {beginAtZero: true, ticks: {stepSize: 2}}}, plugins: {legend: {display: false}}}
});

const ctxLineas = document.getElementById('graficoLineas');
new Chart(ctxLineas, {
  type: 'line',
  data: {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {label: 'Prácticas Iniciadas', data: [5, 8, 12, 15, 10, 13], borderColor: 'rgba(75, 192, 192, 1)', backgroundColor: 'rgba(75, 192, 192, 0.2)', tension: 0.4},
      {label: 'Prácticas Finalizadas', data: [3, 5, 7, 10, 8, 12], borderColor: 'rgba(54, 162, 235, 1)', backgroundColor: 'rgba(54, 162, 235, 0.2)', tension: 0.4}
    ]
  },
  options: {responsive: true, scales: {y: {beginAtZero: true, ticks: {stepSize: 3}}}, plugins: {legend: {position: 'bottom'}}}
});