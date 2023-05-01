if (document.readyState == "loading") {
    // documento cargando
    document.addEventListener("DOMContentLoaded", readyDoc)
} else {
    readyDoc()
}

async function readyDoc(){
    const response = await fetch("/api/products?size=-1")
    const infoAPI = await response.json()

    displayProds(infoAPI.products)

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
            <article>
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