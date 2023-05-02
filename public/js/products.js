if (document.readyState == "loading") {
    // documento cargando
    document.addEventListener("DOMContentLoaded", readyDoc)
} else {
    readyDoc()
}

async function readyDoc(){
    const productosFiltrados = JSON.parse(sessionStorage.getItem("productosFiltrados"))
    const busqueda = sessionStorage.getItem("busqueda");
    const mostrarFavoritos = sessionStorage.getItem("mostrarFavoritos");
    
    // limpiar storage
    sessionStorage.setItem("mostrarFavoritos", "")
    sessionStorage.setItem("busqueda", "")

    if (busqueda) {
        document.getElementById("texto-buscado").value = busqueda;
    } else {
        if (mostrarFavoritos && mostrarFavoritos == "mostrarFavoritos") {
            document.getElementById("agregar_favoritos").checked = true;
        }
    }

    if (productosFiltrados != null && productosFiltrados.length > 0){
        displayProds(productosFiltrados)
        sessionStorage.setItem("productosFiltrados", JSON.stringify([]))
    } else {
        filtrarProductos()
    }
}

function displayProds(products){
    let container = document.getElementById('contenedor-productos')
    container.innerHTML = ``
    let favoritos = JSON.parse(localStorage.getItem("favoritos"))
    for (let i = 0; i < products.length; i++) {
        let claseEstrella = "estrella-no-seleccionada"
        if (JSON.parse(localStorage.getItem("favoritos"))) {
            claseEstrella = favoritos.includes(products[i].id) ? "estrella-seleccionada": "estrella-no-seleccionada"
        }

        container.innerHTML += `
            <article class="article-prod">
                    <div class="info-de-producto">
                    <i id="estrella-${products[i].id}" class="fa-solid fa-star estrella ${claseEstrella}" onClick="addFavoritos(${products[i].id})"></i>
                    <a href="/products/productDetail/${products[i].id}">
                        <img src="${products[i].imagen}" alt="${products[i].imagen}" width="360">
                        <div><p>${products[i].nombre} - ${products[i].marca}</p></div> 
                        <div><p>$${products[i].precio}</p></div>
                        </a>
                    </div>
            </article>
        `
    }
}

async function filtrarProductos() {

    const orden = sessionStorage.getItem("orden") || "ASC";
    const textoBuscado = document.getElementById("texto-buscado").value;
    const estiloBuscado = document.getElementById("estiloVida_prod").value;
    const marcaBuscada = document.getElementById("marca-prod").value;
    const categoriaBuscada = document.getElementById("categoria-prod").value;
    const campoOrden = document.getElementById("ordenar_prod").value;
    const favoritos = document.getElementById("agregar_favoritos").checked;

    let listaFavoritos = undefined
    if (favoritos) {
        listaFavoritos = JSON.parse(localStorage.getItem("favoritos"));
        if (listaFavoritos == null) {
            listaFavoritos = []
        }
    }

    const filtrado = {
        texto: textoBuscado,
        estiloVida: estiloBuscado,
        marca: marcaBuscada,
        categoria: categoriaBuscada,
        campoOrden: campoOrden,
        orden: orden,
        listaFavoritos: listaFavoritos
    }

    const response = await fetch("/api/products/filterProducts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(filtrado),
    });

    const infoAPI = await response.json();

    if (infoAPI.status != 500) {
        // sessionStorage.setItem("productosFiltrados", JSON.stringify(infoAPI.data));
        displayProds(infoAPI.data)
    }
}

function seleccionarFlecha(flecha) {
    let elems = document.getElementsByClassName("flecha");

    for(let i=0; i < elems.length; i++) {
        if (elems[i].id == flecha) {
            elems[i].classList.remove("flecha-no-seleccionada");
            elems[i].classList.add("flecha-seleccionada");
        } else {
            elems[i].classList.remove("flecha-seleccionada");
            elems[i].classList.add("flecha-no-seleccionada");
        }
    }

    if (flecha == "orden-flecha-arriba") {
        sessionStorage.setItem("orden", "ASC");
    } else {
        sessionStorage.setItem("orden", "DESC")
    }

}