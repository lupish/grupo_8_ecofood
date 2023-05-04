if (document.readyState == "loading") {
    // documento cargando
    document.addEventListener("DOMContentLoaded", readyDoc)
} else {
    readyDoc()
}

async function readyDoc() {
    let endpoint = "/api/products?size=-1";
    const response = await fetch(endpoint);
    const infoAPI = await response.json();

    cargarSubMenu(infoAPI.countByCategories, "submenu-categorias")
    cargarSubMenu(infoAPI.countByLifeStyles, "submenu-estilosVida")
    cargarSubMenu(infoAPI.countByBrands, "submenu-marcas")

}

function cargarSubMenu(lista, idLista) {
    let submenu = document.getElementById(idLista);

    submenu.innerHTML = ""
    Object.keys(lista).forEach(elem => {
        submenu.innerHTML += `<li class="menu__item"><a class="menu__link")">${elem}</a></li>`
    })

    console.log(Object.keys(lista))
}