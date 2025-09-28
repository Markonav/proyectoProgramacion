// slidebarCuenta.js

document.addEventListener('DOMContentLoaded', function() {
    // Configurar navegación activa solo para el sidebar
    setupSidebarNavigation();
});

function setupSidebarNavigation() {
    // Obtener la página actual
    const currentPage = getCurrentPage();
    
    // Seleccionar solo los enlaces del sidebar
    const sidebarLinks = document.querySelectorAll('.perfil__nav a');
    
    // Remover clase active de todos los enlaces del sidebar
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Agregar clase active al enlace correspondiente del sidebar
    sidebarLinks.forEach(link => {
        const linkPage = getPageFromHref(link.getAttribute('href'));
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

function getCurrentPage() {
    // Obtener el nombre del archivo actual
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    // Mapeo de páginas para casos especiales
    const pageMap = {
        '': 'perfil.html',
        'index.html': 'perfil.html',
        'perfil.html': 'perfil.html',
        'cuenta.html': 'cuenta.html',
        'favoritos.html': 'favoritos.html'
    };
    
    return pageMap[page] || page;
}

function getPageFromHref(href) {
    // Si el href es vacío o null, considerar perfil.html
    if (!href || href === '#' || href === '') {
        return 'perfil.html';
    }
    
    // Extraer solo el nombre del archivo
    return href.split('/').pop();
}