window.onload = function() {
    actualizarIconoCarrito()
}

function actualizarIconoCarrito() {
    let pCart = document.getElementById("p-icon-cart");
    if (JSON.parse(localStorage.getItem("carrito")) == null || JSON.parse(localStorage.getItem("carrito")).length == 0){
        pCart.innerText = ""
    } else {
        pCart.innerText = JSON.parse(localStorage.getItem("carrito")).length;
    }
}

    