const datos = {
  estudiantes: 120,
  empresas: 18,
  tutores: 22,
  practicas: 40
};

document.getElementById('estudiantesCount').textContent = datos.estudiantes;
document.getElementById('empresasCount').textContent = datos.empresas;
document.getElementById('tutoresCount').textContent = datos.tutores;
document.getElementById('practicasCount').textContent = datos.practicas;

const ctx = document.getElementById('chartResumen');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Estudiantes', 'Empresas', 'Tutores', 'Prácticas'],
    datasets: [{
      label: 'Cantidad',
      data: Object.values(datos),
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(153, 102, 255, 0.8)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {display: false},
      title: {display: true, text: 'Resumen del Sistema'}
    },
    scales: {
      y: {beginAtZero: true, ticks: {stepSize: 20}}
    }
  }
});