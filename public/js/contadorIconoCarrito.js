window.onload = function() {
    actualizarIconoCarrito()

    
}

function reportWindowSize() {
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

async function mostrarEstilosVida() {
    let divEstilosVida = document.getElementById("menu-hamburguesa-estilosVida")
    
    const response = await fetch("/api/products/listLyfeStyles")
    const APIestilosVida = await response.json()
    const estilosVida = APIestilosVida.data;
    
    if (APIestilosVida.status == 200) {
        divEstilosVida.innerHTML = "<h3>Recorré los distintos estilos de vida</h3>";
        divEstilosVida.innerHTML += "<div>"
        let divIconos = "<div>"
        for(let i = 0; i < estilosVida.length; i++) {
            console.log(estilosVida[i])
            divIconos += `
                <div>
                    <a href="/products/listProducts/${estilosVida[i].id}">
                        <img src="${estilosVida[i].img}" alt="${estilosVida[i].img}">    
                    </a>
                    <p>${estilosVida[i].nombre}</p>
                </div>
            `
        }
        divIconos += "</div>"
        divEstilosVida.innerHTML += divIconos
    }
}

function menuHamburguesa() {
    let menuHamburguesaOpaco = document.getElementById("opaco-menu-hamburguesa");
    menuHamburguesaOpaco.style.display = "block";

    let menuHamburguesa = document.getElementById("menu-hamburguesa");
    menuHamburguesa.style.display = "flex";
    menuHamburguesa.style.flexDirection = "column";
    menuHamburguesa.style.alignItems = "center";

    // mostrar los estilos de vida, obtenerlos de una api
    mostrarEstilosVida()

}
    