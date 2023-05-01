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
    let productos = await fetchApi('/api/products?size=-1')
    let searchBar = document.getElementById("buscador")

    searchBar.addEventListener('change', (e) => {
        filter(e.target.value, productos.products)
    })
}

function filter(busqueda, productos){
    /*productos.sort((a,b)=>{
        if(a.nombre < b.nombre) return -1
        if(a.nombre > b.nombre) return 1
        return 0
    })*/

    if (busqueda) {
        let filtro = productos.filter(elem =>
            elem.nombre.toLowerCase().includes(busqueda.toLowerCase())
            || elem.descripcionCorta.toLowerCase().includes(busqueda.toLowerCase())
            || elem.descripcionLarga.toLowerCase().includes(busqueda.toLowerCase())
        )

        if (filtro.length == 0) {
            window.location.replace("/products/product-not-found")
        } else {
            sessionStorage.setItem("busqueda", busqueda);
            sessionStorage.setItem("productosFiltrados", JSON.stringify(filtro));

            window.location.replace("/products/listProducts");
        }
        
    }

}
