if (document.readyState == "loading") {
    // documento cargando
    document.addEventListener("DOMContentLoaded", readyDoc)
} else {
    readyDoc()
}

async function fetchApi(endpoint){
    const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
            Accept: 'application/json', 'Content-type': 'application/json'
        }
    })
    const info = await res.json()
    return info
}

async function readyDoc(){
    const productos = await fetchApi('/api/products')
    displayProds(productos.products)
    let searchBar = document.getElementById("buscador")
    searchBar.addEventListener('change', (e)=>{
        filter(e.target.value, productos.products)
    })
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
             <div><p>${products[i].precio}</p></div>
         </div>
     </a>
 </article>

     `
     }
}

function filter(busqueda, productos){

    productos.sort((a,b)=>{
        if(a.nombre < b.nombre) return -1
        if(a.nombre > b.nombre) return 1
        return 0
    })

    if(busqueda == ''){
        displayProds(productos)
    }else{
        let filtro = productos.filter(elem => elem.nombre.toLowerCase().includes(busqueda.toLowerCase()) || elem.descripcionCorta.toLowerCase().includes(busqueda.toLowerCase()) ||  elem.descripcionLarga.toLowerCase().includes(busqueda.toLowerCase()) )
        displayProds(filtro)
    }

}
