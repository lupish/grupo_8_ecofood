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
    console.log("readyDoc");

    let productos = await fetchApi('/api/products')
    let searchBar = document.getElementById("buscador")

    searchBar.addEventListener('change', (e) => {
        filter(e.target.value, productos.products)
    })
}

function filter(busqueda, productos){
    console.log(busqueda)
    console.log(productos);
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

        console.log(filtro)

        if (filtro.length == 0) {
            console.log("Redirigiedno a home")
            window.location.replace("/products/product-not-found")
        } else {
            console.log("Búsqueda guardada en storage")
            sessionStorage.setItem("productosFiltrados", JSON.stringify(filtro));

            window.location.replace("/products/listProducts")
        }
        
    }

}
