const toggleButton = document.getElementById('theme-toggle');

toggleButton.addEventListener('click', () => {
    // Intercambia la clase dark-mode en el body
    document.body.classList.toggle('dark-mode');
    
    // Cambia el texto del botón según el modo activo
    if (document.body.classList.contains('dark-mode')) {
        toggleButton.textContent = '☀️ Modo Claro';
    } else {
        toggleButton.textContent = '🌙 Modo Oscuro';
    }
});
