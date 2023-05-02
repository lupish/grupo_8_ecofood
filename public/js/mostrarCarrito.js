if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', readyDoc())
} else {
    readyDoc()
}

function readyDoc() {
    if (JSON.parse(localStorage.getItem("carrito")) == null || JSON.parse(localStorage.getItem("carrito")).length == 0){
        displayCarritoVacio()
    } else {
        displayCarrito();
    }

    document.getElementById("aviso-compra").innerText = ""
}

function displayCarritoVacio() {
    // padre que lista los productos del carrito
    let padre = document.getElementById("carrito-padre")

    padre.innerHTML = `
    <img src="/img/products/empty-cart.png">
    `

    calcularFooter([])

    actualizarIconoCarrito()
}

function displayCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito"))

    // padre que lista los productos del carrito
    let padre = document.getElementById("carrito-padre")

    padre.innerHTML = "";
    for (let i = 0; i < carrito.length; i++) {
        padre.innerHTML += `
        <article class="carrito-articulo">
            <img class="carrito-articulo-imagen" src="${carrito[i].img}" alt="${carrito[i].img}">
            <div class="carrtito-articulo-item">
                <div class="carrito-articulo-descripcion-item">
                    <p class="carrito-articulo descripcion-nombre">${carrito[i].nombre}</p>
                    <p class="carrito-articulo descripcion-precio">$${carrito[i].subtotal}</p>
                </div>
                <div class="carrito-articulo-accion-item">
                    <div class="carrito-articulo-accion-cantidad">
                        <i class="fa-solid fa-minus arti-cant" onclick="botonQuitar(${carrito[i].id})"></i>
                        <p id="prod-cant">${carrito[i].cantidad}</p>
                        <i class="fa-solid fa-plus arti-cant" onclick="botonAgregar(${carrito[i].id})"></i>
                    </div>
                    <div class="carrito-articulo-accion-eliminar">
                        <i class="fa-solid fa-trash-can arti-trash" onclick="botonRemover(${carrito[i].id})"></i>
                    </div>
                </div>
            </div>
        </article>
        `
    }

    // footer del carrito
    calcularFooter(carrito)

    actualizarIconoCarrito()
}

function calcularFooter(carrito) {
    // calcular subtotal: subtotal de los productos del carrito
    const subtotal = carrito.reduce((acumulador, elem) => {
        return acumulador + elem.subtotal;
    }, 0)

    let footerSubtotal = document.getElementById("carrito-footer-subtotal")
    footerSubtotal.innerText = `$${subtotal}`

    // calcular total: subtotal + envio
    const envio = parseFloat(document.getElementById("carrito-footer-envio").innerText.replace("$", 0));
    const total = subtotal + envio;

    let footerTotal = document.getElementById("carrito-footer-total")
    footerTotal.innerText = `$${total}`
}

function botonAgregar(id) {
    const carrito = JSON.parse(localStorage.getItem("carrito"))
    let prod = carrito.find((elem) => elem.id == id)
    if (prod) {
        // el producto existe en el carrito
        prod.cantidad += 1;
        prod.subtotal += prod.precio;
    }

    // cargar el carrito
    localStorage.setItem("carrito", JSON.stringify(carrito))
    displayCarrito()
}

function botonQuitar(id) {
    const carrito = JSON.parse(localStorage.getItem("carrito"))
    let prod = carrito.find((elem) => elem.id == id)
    if (prod) {
        // el producto existe en el carrito
        if (prod.cantidad > 1) {
            prod.cantidad -= 1;
            prod.subtotal -= prod.precio;
        } else {
            // quitar del carrito
            botonRemover(id)
            return
        }
    }

    // cargar el carrito
    localStorage.setItem("carrito", JSON.stringify(carrito))
    displayCarrito()
}

function botonRemover(id) {
    const carrito = JSON.parse(localStorage.getItem("carrito"));
    const carritoNuevo = carrito.filter((elem) => elem.id != id);

    // cargar el carrito
    localStorage.setItem("carrito", JSON.stringify(carritoNuevo))

    if (carritoNuevo.length > 0) {
        displayCarrito()
    } else {
        displayCarritoVacio()
    }
}

function displayCompraExitosa() {
    document.getElementById("aviso-compra").innerText = "¡Compra finalizada con éxito!"


    let padre = document.getElementById("carrito-padre")

    padre.innerHTML = `
    <h4>¡Compra finalizada con éxito!</h4>
    <img src="/img/products/empty-cart.png">
    `

    calcularFooter([])
    actualizarIconoCarrito()
}

async function finalizarCompra() {
    const carrito = JSON.parse(localStorage.getItem("carrito"))

    if (carrito && carrito.length > 0) {
        let data = {
            carrito: carrito,
            total: document.getElementById("carrito-footer-total").innerText
        }
        
        const response = await fetch("/api/products/purchase/complete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(data),
        });
        const infoAPI = await response.json()

        let avisoCompra = document.getElementById("aviso-compra")
        if (infoAPI.status == 201) {
            // vaciar el carrito
            localStorage.setItem("carrito", JSON.stringify([]))
            
            avisoCompra.innerText = "¡Compra finalizada con éxito!"
            avisoCompra.className = "compra-existosa"
            displayCarritoVacio()
        } else {
            avisoCompra.innerText = "Su compra no se pudo finalizar, intentalo más tarde o contactanos"
            avisoCompra.className = "compra-error"
        }

    }


}