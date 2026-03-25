// configure flags
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
        context.modules = await fetch('/static/JSON/modules.JSON').then(r => r.json())
    }

    // context an nunjucks übergeben
    const html = await nunjucks.render(`${page}.njk`, context);
    document.getElementById('app').innerHTML = html;
    console.log("Render:", `${page}.njk`);

    activeNav(page);
}

// toggle nav active

function activeNav(page) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#/${page}`);
    });
}


window.addEventListener('hashchange', render);
render();