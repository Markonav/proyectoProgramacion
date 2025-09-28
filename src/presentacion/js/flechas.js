const carousel = document.querySelector('.category-buttons');
document.querySelector('.arrow.left').onclick = () => carousel.scrollBy({ left: -200, behavior: 'smooth' });
document.querySelector('.arrow.right').onclick = () => carousel.scrollBy({ left: 200, behavior: 'smooth' });
