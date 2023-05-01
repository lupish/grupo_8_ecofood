if (document.readyState == "loading") {
    // documento cargando
    document.addEventListener("DOMContentLoaded", readyDoc)
} else {
    readyDoc()
}

function readyDoc() {
    const mirarFavoritos = document.getElementById("mirar-favoritos");
    mirarFavoritos.addEventListener("click", (e) => {
        e.preventDefault()
        mostrarFavoritos()
    })
}

function addFavoritos(prodId) {
    let favoritos = JSON.parse(localStorage.getItem("favoritos"));
    
    // seleccionar estrella
    let idEstrella = `estrella-${prodId}`;

    if (favoritos == null || favoritos.length == 0) {
        favoritos = []
        favoritos.push(parseInt(prodId))

        updateEstrella(idEstrella, "estrella-no-seleccionada", "estrella-seleccionada");
    } else {
        let prodEnFavoritos = favoritos.find(elem => elem == prodId)
        if (!prodEnFavoritos) {
            favoritos.push(parseInt(prodId))

            updateEstrella(idEstrella, "estrella-no-seleccionada", "estrella-seleccionada");
        } else {
            favoritos = favoritos.filter(elem => elem != prodId)
            
            updateEstrella(idEstrella, "estrella-seleccionada", "estrella-no-seleccionada");
        }   
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos))
}

function updateEstrella(clase, claseVieja, claseNueva) {
    document.getElementById(clase).classList.remove(claseVieja);
    document.getElementById(clase).classList.add(claseNueva);
}

function mostrarFavoritos() {
    sessionStorage.setItem("mostrarFavoritos", "mostrarFavoritos")

    window.location.replace("/products/listProducts");
}

