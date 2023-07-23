;(function initTheme() {
    var theme = localStorage.getItem('theme') || 'light'
    if (theme === 'dark') {
        document.querySelector('html').classList.add('dark')
        var navElements = document.querySelectorAll('.nav');
        navElements.forEach(function(nav) {
            nav.classList.add('dark');
        });
    }
})()