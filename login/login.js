let login = [
  {id: 1, email: 'ana@uleam.edu.ec', password: '123456'}
];
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email.endsWith("@uleam.edu.ec")) {
    alert("⚠️ Debe ingresar un correo institucional @uleam.edu.ec");
    return;
  }

  if (password.length < 6) {
    alert("⚠️ La contraseña debe tener al menos 6 caracteres.");
    return;
  }

  alert("✅ Inicio de sesión exitoso. Redirigiendo al panel...");
  window.location.href = "../dashboard/dashboard.html";
});
