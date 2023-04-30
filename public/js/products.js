if (document.readyState == "loading") {
    // documento cargando
    document.addEventListener("DOMContentLoaded", readyDoc)
} else {
    readyDoc()
}

async function readyDoc(){
    const productosFiltrados = JSON.parse(sessionStorage.getItem("productosFiltrados"))

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