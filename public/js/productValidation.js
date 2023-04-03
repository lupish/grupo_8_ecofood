window.onload = function () {
    console.log("productValidation")
    form = document.getElementById("form-prod-nuevo");
    botonSubmit = document.getElementById("boton-prod-nuevo");
    console.log(botonSubmit)

    form.addEventListener("submit", (e) => {
        e.preventDefault()

        // obtener campos del formulario
        let nombre = document.getElementById("prod-nombre");
        let tieneCategoria = document.querySelector("input[type='radio'][name=prod_categoria]:checked");
        let tieneEstiloVida = document.querySelector("input[type='checkbox'][name=prod_estilosVida]:checked");
        let tieneMarca = document.querySelector("input[type='radio'][name=prod_marca]:checked");
        let precio = document.getElementById("prod-precio");
        let descrCorta = document.getElementById("prod-descripcion-corta");
        let descrLarga = document.getElementById("prod-descripcion-larga");
        let fotos = document.getElementById("prod-fotos").files;

        errores = []
        if (nombre.value.length < 5) {
            errores.push("El nombre debe tener al menos 5 caracteres")
            nombre.classList.add('input-form-no-aceptado')
            // mostrar mensaje de error
        }
        if (tieneCategoria == undefined) {
            errores.push("La categoría del producto debe ser elegida")
            document.getElementById("div-prod-categoria").classList.add('input-form-no-aceptado')
            // mostrar mensaje de error
        }
        if (tieneEstiloVida == undefined) {
            errores.push("El estilo de vida del producto debe ser elegido")
            document.getElementById("div-prod-estilosVida").classList.add('input-form-no-aceptado')
            // mostrar mensaje de error
        }
        if (tieneMarca == undefined) {
            errores.push("La marca del producto debe ser elegida")
            document.getElementById("div-prod-marca").classList.add('input-form-no-aceptado')
            // mostrar mensaje de error
        }
        if (precio.value <= 0) {
            errores.push("El precio debe ser mayor a cero")
            precio.classList.add('input-form-no-aceptado')
            // mostrar mensaje de error
        }
        if (descrCorta.value.length == 0) {
            errores.push("La descripción corta del producto no puede ser vacía")
            descrCorta.classList.add('input-form-no-aceptado')
            // mostrar mensaje de error
        }
        if (descrLarga.value.length < 20) {
            errores.push("La descripción larga del producto no puede ser vacía y debe contener al menos 20 caracteres")
            descrLarga.classList.add('input-form-no-aceptado')
            // mostrar mensaje de error
        }
        if (fotos != undefined) {
            const extensions = ['.jpg', '.png', '.gif', '.jpeg']
            let fotosOk = true;
            for (let i = 0; i < fotos.length; i++) {
                if (
                    !(fotos[i].type.includes("jpg")  || fotos[i].type.includes("jpeg")
                    || fotos[i].type.includes("gif") || fotos[i].type.includes("png"))
                ) {
                    fotosOk = false;
                    break;
                }
            }

            if (!fotosOk) {
                errores.push(`Las extensiones permitidas son : ${extensions.join(", ")}`)
                document.getElementById("div-prod-fotos").classList.add('input-form-no-aceptado')
                // mostrar mensaje de error
            }
            
        }
        
        if (errores.length == 0) {
            form.submit()
        }
        console.log(errores)
    })

}