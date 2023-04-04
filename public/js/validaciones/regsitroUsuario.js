window.onload = function () {
    console.log("registroUsuario")
    form = document.getElementById("form");
    botonSubmit = document.getElementById("botonEnviar");
    console.log(botonSubmit)

    form.addEventListener("submit", (e) => {
        e.preventDefault()

        // obtener campos del formulario
        const form = document.getElementById('form'); 
        const nombre = document.getElementById('nombre');
        const email = document.getElementById('email');
        const contrasenia = document.getElementById('contrasenia');
        const confirmarContrasenia = document.getElementById('confirmar-contrasenia');
        const fotos = document.getElementById("user_foto").files;

        errores = []

        if (nombre.value.length < 2) {
            setError(nombre, "El nombre debe tener al menos 2 caracteres")
        }else{
            setSuccess(nombre)
        }

        if (email.value === '') {
            setError(email, "Este campo es obligatorio")
        }else if(!isEmail(email.value)){
            setError(email, "Debe igresar un email válido(Ej: usuario@dominio.com)")
        }else{
            setSuccess(email)
        }

        if (contrasenia.value === '') {
            setError(contrasenia, "Este campo es obligatorio")
        }else if(!contraseniaValida(contrasenia.value)){
            setError(contrasenia, "La contraseña debe tener al menos 8 caracteres, letras mayúsculas y minúsculas, un número y un símbolo")
        }else{
             console.log(contrasenia.value)
        }

        if (confirmarContrasenia.value === '') {
            setError(confirmarContrasenia, "Debe confirmar la contraseña")
        }else if(contrasenia.value === confirmarContrasenia.value){
            setError(confirmarContrasenia, "Las contraseñas deben coincidir")
        }else{

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
                setError(fotos,`Las extensiones permitidas son : ${extensions.join(", ")}` )
            }  
        }else{

        }


        function isEmail(){
            return /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(email);
        }
        function contraseniaValida (){
            var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,}$/.test(contrasenia);
        }
        function setError(input, message) {
            input.classList.add('input-form-no-aceptado')
            const msg = document.querySelector('div').innerHTML = `<small> ${message} </small>`
        }
        function setSuccess(input) {
            input.classList.remove('input-form-no-aceptado')
            input.classList.add('input-form-aceptado')
        }


        if (errores.length === 0) {
            form.submit()
        }
        console.log(errores)
    })

}