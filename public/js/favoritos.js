if (document.readyState == "loading") {
    // documento cargando
    document.addEventListener("DOMContentLoaded", readyDoc)
} else {
    readyDoc()
}

function readyDoc() {
    console.log("Favoritos - readyDoc");
}

function addFavoritos(prodId) {
    let favoritos = JSON.parse(localStorage.getItem("favoritos"))

    if (favoritos == null || favoritos.length == 0) {
        favoritos = []
        favoritos.push(parseInt(prodId))
    } else {
        let prodEnFavoritos = favoritos.find(elem => elem == prodId)
        if (!prodEnFavoritos) {
            favoritos.push(parseInt(prodId))
        }
        
    }

    // seleccionar estrella
    let idEstrella = `estrella-${prodId}`
    console.log(idEstrella)
    document.getElementById(idEstrella).classList.remove("estrella-no-seleccionada");
    document.getElementById(idEstrella).classList.remove("estrella-seleccionada");

    localStorage.setItem("favoritos", JSON.stringify(favoritos))
}

function mostrarFavoritos() {
    sessionStorage.setItem("mostrarFavoritos", "mostrarFavoritos")

    window.location.replace("/products/listProducts");
}

