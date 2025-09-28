// Toggle rojo/normal en corazones
document.querySelectorAll('.icon-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    btn.textContent = btn.classList.contains('active') ? '❤' : '♡';
  });
});

