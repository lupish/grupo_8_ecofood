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
        console.log("Favoritos vacios");
        favoritos = []
        favoritos.push(prodId)
    } else {
        let prodEnFavoritos = favoritos.find(elem => elem == prodId)
        if (!prodEnFavoritos) {
            favoritos.push(prodId)
        }
        
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos))
    console.log(favoritos);
}

