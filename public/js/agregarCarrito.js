if (document.readyState == "loading") {
    // documento cargando
    document.addEventListener("DOMContentLoaded", readyDoc)
} else {
    readyDoc()
}

function readyDoc() {
    // chequear si existe el carrito
    if (JSON.parse(localStorage.getItem("carrito")) == null) {
        let carrito = []
        localStorage.setItem("carrito", JSON.stringify(carrito))
    }

    // agarro el boton de agergar al carrito
    let agregarCarrito = document.getElementById("agregar-carrito")
    
    console.log(agregarCarrito)
    agregarCarrito.addEventListener("click", agregarElemCarrito)
}

function agregarElemCarrito() {
    console.log("Evento del agregar carrito");

    let prod = {
        id: parseFloat(document.getElementById("prod-id").innerText),
        nombre: document.getElementById("prod-nombre-marca").innerText,
        precio: parseFloat(document.getElementById("prod-precio").innerText.replace("$ ", "")),
        img: document.getElementById("prod-img-0").alt
    }

    let carrito = JSON.parse(localStorage.getItem("carrito"))
    const cantProd = parseFloat(document.getElementById("prod-cant").innerText);
    console.log(cantProd)

    if (carrito.length == 0) {
        // carito vacio
        prod.cantidad = cantProd;
        prod.subtotal = cantProd * prod.precio;

        carrito.push(prod);
    } else {
        console.log("Carrito existente!")

        // buscar si existe producto
        let prodEnCarrito = carrito.find((elem) => elem.id == prod.id)
        if (prodEnCarrito) {
            // carrito con mi producto
            prodEnCarrito.cantidad += cantProd;
            prodEnCarrito.subtotal += (cantProd * prod.precio);
        } else {
            // carito sin mi producto
            prod.cantidad = cantProd;
            prod.subtotal = cantProd * prod.precio;

            carrito.push(prod);
        }
    }

    localStorage.setItem("carrito", JSON.stringify(carrito))
}

function botonAgregar() {
    const cantProd = parseFloat(document.getElementById("prod-cant").innerText);
    document.getElementById("prod-cant").innerText = cantProd + 1;
}

function botonQuitar() {
    const cantProd = parseFloat(document.getElementById("prod-cant").innerText);

    if (cantProd > 1) {
        document.getElementById("prod-cant").innerText = cantProd - 1;
    }
    
}