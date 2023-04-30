const session = require("express-session");

if (document.readyState == "loading") {
    // documento cargando
    document.addEventListener("DOMContentLoaded", readyDoc)
} else {
    readyDoc()
}

async function readyDoc(){
    const productosFiltrados = JSON.parse(sessionStorage.getItem("productosFiltrados"))
    const busqueda = sessionStorage.getItem("busqueda");

    if (busqueda) {
        document.getElementById("texto-buscado").value = busqueda;
    }

    if (productosFiltrados != null && productosFiltrados.length > 0){
        displayProds(productosFiltrados)
        sessionStorage.setItem("productosFiltrados", JSON.stringify([]))
    }
}

function displayProds(products){
    let container = document.getElementById('contenedor-productos')
    container.innerHTML = ``
    for (let i = 0; i < products.length; i++) {
        container.innerHTML += `
            <article class="article-prod">
                <a href="/products/productDetail/${products[i].id}">
                    <div class="info-de-producto">
                        <i id="estrella" class="fa-solid fa-star"></i>
                            <img src="${products[i].imagen}" alt="" width="360">
                        <div><p>${products[i].nombre} - ${products[i].marca}</p></div> 
                        <div><p>$${products[i].precio}</p></div>
                    </div>
                </a>
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

    const filtrado = {
        "texto": textoBuscado,
        "estiloVida": estiloBuscado,
        "marca": marcaBuscada,
        "categoria": categoriaBuscada,
        "campoOrden": campoOrden,
        "orden": orden
    }

    const response = await fetch("/api/products/filterProducts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(filtrado), // body data type must match "Content-Type" header
    });

    const infoAPI = await response.json();

    if (infoAPI.status != 500) {
        sessionStorage.setItem("productosFiltrados", JSON.stringify(infoAPI.data));
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