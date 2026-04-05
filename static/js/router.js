// configure nunjucks
nunjucks.configure('./templates', { 
    autoescape: true,
    async: true 
});

// render function
async function render() {
    // page depending on # in url
    const page = location.hash.replace('#/', '') || 'index';

    // JS object - templating context
    let context = {};

    if (page === "modules"){
        // fetch modules from JSON file
        // Githubpages
        context.modules = await fetch('https://badil3in.github.io/geoxtensions/static/JSON/modules.JSON').then(r => r.json())
        // local
        // context = await fetch('/static/JSON/modules.JSON').then(r => r.json())
    }

    // context an nunjucks übergeben
    const html = await nunjucks.render(`${page}.njk`, {
        isSearch: false,
        modules: context}, function (err, html) {
        document.getElementById('app').innerHTML = html;
        activeNav(page);
        console.log("err :", err)
        console.log("data :", {
            isSearch: false,
            modules: context.modules})

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

// on submit search
let form = document.querySelector("form[role=search]");
let input = document.getElementById('search');

form.addEventListener('submit', function(event) {
    let query = input.value;
    event.preventDefault();
    if (!query) {
        render();
    }
    else {
        search(query);        
    }
})

async function search(query) {
    let data = [];
    let results = [];

    // public
    data.modules = await fetch('https://badil3in.github.io/geoxtensions/static/JSON/modules.JSON')
    // local
    // data.modules = await fetch('/static/JSON/modules.JSON')
        .then(r => r.json());

    console.log('data: ', data);    
    console.log('query: ', query);

    for(item of data.modules) {
        console.log("item.name: ", item.name);
        if (item.name.toLowerCase().includes(query.toLowerCase())) {
            results.push(item);
            console.log("results name:", results);
            continue;
        }
        else if (item.summary.toLowerCase().includes(query.toLowerCase())){
            results.push(item);
            console.log("results summary:", results);
            continue;
        }
        for(desc of item.description) {
            for (sub of desc.subtext) {
                if(sub.toLowerCase().includes(query.toLowerCase())) {
                    results.push(item);
                    console.log("results subtext:", results);
                    continue;   
                    }            
                }
            if (desc.text.toLowerCase().includes(query.toLowerCase())) {
                results.push(item);
                console.log("results text:", results);
                continue;            
            }
            else {
                console.log("no results :", results);
            }
        }
    }
        
        // else if (item.description.includes(query)) {
        //     results.push(item);
        //     console.log("results if2:", results);
        //     continue;
        // // }
        // else {
        //     console.log("no results :", results);
        // }
    // }
    nunjucks.render('modules.njk', {
        isSearch: true,
        modules: results
        }, function (err, html) {
            if (err){
                console.log("err :", err);
                return;
            }
        document.getElementById('app').innerHTML = html;
      });
}

window.addEventListener('hashchange', render);
render();