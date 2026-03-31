// configure nunjucks
nunjucks.configure('/templates', { 
    autoescape: true,
    async: true 
});

// render function
async function render() {
    const page = location.hash.replace('#/', '') || 'index';

    // JS object - templating context
    let context = {};

    if (page === "modules") {
        // fetch modules from JSON file
        context.modules = await fetch('https://badil3in.github.io/GeoXtensions/static/JSON/modules.JSON').then(r => r.json())
    }

    // context an nunjucks übergeben
    const html = await nunjucks.render(`${page}.njk`, context, function (err, html) {
        document.getElementById('app').innerHTML = html;
        activeNav(page);
    });
}

// toggle nav active
function activeNav(page) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#/${page}`);
    });
}

// close nav burgermenu on outsideclick
document.addEventListener('click', function(event) {
    const navbar = document.getElementById('navbarSupportedContent');
    const toggler = document.querySelector('.navbar-toggler');

    // navbar element shown
    // click nicht auf navbar
    // click nicht auf toggler
    if(navbar.classList.contains('show') 
        && !navbar.contains(event.target) 
        && !toggler.contains(event.target)) {

        // click auf toggler auslösen
        toggler.click();
    }
})

window.addEventListener('hashchange', render);
render();