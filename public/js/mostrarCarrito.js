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
}

function displayCarritoVacio() {
    console.log("Mostrar carrito vacío")
}

function displayCarrito() {
    console.log("Mostrar carrito")

    const carrito = JSON.parse(localStorage.getItem("carrito"))
    console.log(carrito)

    // padre que lista los productos del carrito
    let padre = document.getElementById("carrito-padre")
    console.log(padre)

    for (let i = 0; i < carrito.length; i++) {
        padre.innerHTML += `
        <article class="carrito-articulo">
            <img class="carrito-articulo-imagen" src="${carrito[i].img}" alt="${carrito[i].img}">
            <div class="carrtito-articulo-item">
                <div class="carrito-articulo-descripcion-item">
                    <p class="carrito-articulo descripcion-nombre">${carrito[i].nombre}</p>
                    <p class="carrito-articulo descripcion-precio">$${carrito[i].precio}</p>
                </div>
                <div class="carrito-articulo-accion-item">
                    <div class="carrito-articulo-accion-cantidad">
                        <i class="fa-solid fa-minus arti-cant" onclick="botonQuitar()"></i>
                        <p id="prod-cant">${carrito[i].cantidad}</p>
                        <i class="fa-solid fa-plus arti-cant" onclick="botonAgregar()"></i>
                    </div>
                    <div class="carrito-articulo-accion-eliminar"><i class="fa-solid fa-trash-can"></i></div>
                </div>
            </div>
        </article>
        `
    }
}