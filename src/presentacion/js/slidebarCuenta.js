

document.addEventListener('DOMContentLoaded', function() {
    
    setupSidebarNavigation();
});

function setupSidebarNavigation() {
   
    const currentPage = getCurrentPage();
    
   
    const sidebarLinks = document.querySelectorAll('.perfil__nav a');
    
    
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
    
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    
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