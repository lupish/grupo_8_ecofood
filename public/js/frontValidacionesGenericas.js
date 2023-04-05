window.onload = function () {
    form = document.getElementById("form-generico");

    form.addEventListener("submit", (e) => {
        e.preventDefault()

        // obtener campos del formulario
        let nombre = document.getElementById("obj-nombre");
        let fotos = document.getElementById("obj-foto").files;

        // limpiar mensajes de error
        document.getElementById("p-obj-nombre").innerText = ""

        // remover clases de errores para los inputs
        nombre.classList.remove('input-form-no-aceptado');
        document.getElementById("form-submit").classList.remove('boton-form-error');


        errores = []
        if (nombre.value.length == 0) {
            errores.push("Debe ingresar un nombre")
            nombre.classList.add('input-form-no-aceptado')
            document.getElementById("p-obj-nombre").innerText = "Debe ingresar un nombre";
        }
        if (fotos != undefined && fotos.length > 0) {
            let foto = fotos[0];
            const extensions = ['.jpg', '.png', '.gif', '.jpeg'];
            if (
                !(foto.type.includes("jpg")  || foto.type.includes("jpeg")
                || foto.type.includes("gif") || foto.type.includes("png"))
            ) {
                errores.push(`Las extensiones permitidas son : ${extensions.join(", ")}`)
                document.getElementsByClassName("div-prod-fotos")[0].classList.add('input-form-no-aceptado')
                document.getElementById("p-obj-foto").innerText = `Las extensiones permitidas son : ${extensions.join(", ")}`;
            }            
        }

        if (errores.length == 0) {
            form.submit()
        } else {
            document.getElementById("form-submit").classList.add('boton-form-error')
        }

    })

}