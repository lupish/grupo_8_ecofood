window.onload = function() {
    actualizarIconoCarrito()

    
}

function reportWindowSize() {
    console.log("OJOOOO, SE AGRANDAAAA")
    console.log()
    if (window.innerWidth >= 1280) {
        let menuHamburguesaOpaco = document.getElementById("opaco-menu-hamburguesa");
        menuHamburguesaOpaco.style.display = "none";
        let menuHamburguesa = document.getElementById("menu-hamburguesa");
        menuHamburguesa.style.display = "none";
    }
}

window.onresize = reportWindowSize;

function actualizarIconoCarrito() {
    let pCart = document.getElementById("p-icon-cart");
    if (JSON.parse(localStorage.getItem("carrito")) == null || JSON.parse(localStorage.getItem("carrito")).length == 0){
        pCart.innerText = ""
    } else {
        pCart.innerText = JSON.parse(localStorage.getItem("carrito")).length;
    }
}

function menuHamburguesa() {
    console.log("MENÚ HAMBURGUESA")

    let menuHamburguesaOpaco = document.getElementById("opaco-menu-hamburguesa");
    menuHamburguesaOpaco.style.display = "block";

    let menuHamburguesa = document.getElementById("menu-hamburguesa");
    menuHamburguesa.style.display = "flex";
    menuHamburguesa.style.flexDirection = "column";
    menuHamburguesa.style.alignItems = "center";

    // mostrar los estilos de vida, obtenerlos de una api

}
    