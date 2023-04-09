window.onload = function () {
    form = document.getElementById("form");
    botonSubmit = document.getElementById("botonEnviar");

    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        
        // obtener campos del formulario
        const form = document.getElementById('form'); 
        const nombre = document.getElementById('nombre');
        const email = document.getElementById('email');
        const contrasenia = document.getElementById('contrasenia');
        const confirmarContrasenia = document.getElementById('confirmar-contrasenia');
        const fotos = document.getElementById("user_foto").files;
        const contraseniaValida =  /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/
        for (let i = 0; i <  document.querySelectorAll('p.form-error').length; i++) {
            document.querySelectorAll('p.form-error')[i].innerText = ''
        }

        errores = []

 if(nombre != null){
        if (nombre.value.length < 2) {
            setError(nombre, "El nombre debe tener al menos 2 caracteres")
        }else{
            console.log(nombre.value);
            setSuccess(nombre)
        }
    }

    if(email != null){
            if (email.value === '') {
            setError(email, "Este campo es obligatorio")
        }else if(!isEmail(email.value)){
            setError(email, "Debe igresar un email válido (Ej: usuario@dominio.com)")
        }else{
            // chequear unicidad del mail via api
            const response = await fetch("/api/users/listUsers", {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            })
            const users = await response.json()
            const userEmail = users.data.find(elem => elem.email == email.value)
            if (userEmail) {
                setError(email, "Ya existe un usuario con el mail ingresado");
            } else {
                setSuccess(email)
            }
        }
    }

    if(contrasenia != null){
        if (contrasenia.value === '') {
            setError(contrasenia, "Este campo es obligatorio")
        }else if(contraseniaValida.test(contrasenia.value) == false){
            setError(contrasenia, "La contraseña debe tener al menos 8 caracteres, letras mayúsculas y minúsculas, un número y un símbolo")
        }else{
            setSuccess(contrasenia) 
        }
    }

    if(confirmarContrasenia != null){    
        if (confirmarContrasenia.value === '') {
            setError(confirmarContrasenia, "Debe confirmar la contraseña")
        }else if(contrasenia.value != confirmarContrasenia.value){
            setError(confirmarContrasenia, "Las contraseñas deben coincidir")
        }else{
            setSuccess(confirmarContrasenia) 
        }
    }

    if(fotos != null){       
        if (fotos != undefined && fotos.length > 0) {
            let foto = fotos[0];
            const extensions = ['.jpg', '.png', '.gif', '.jpeg'];
            if (
                !(foto.type.includes("jpg")  || foto.type.includes("jpeg")
                || foto.type.includes("gif") || foto.type.includes("png"))
            ) {
                setError(document.getElementById("user_foto"),  `Las extensiones permitidas son : ${extensions.join(", ")}`)
            }else{
                setSuccess(document.getElementById("user_foto"),  `Las extensiones permitidas son : ${extensions.join(", ")}`)
            }        
        }
    }


        function isEmail(email){
            return /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(email);
        }
        function setError(input, message) {
            const formControl = input.parentElement;
            console.log(formControl);
            const p = formControl.querySelector('p.form-error');
            input.className = 'input-form-no-aceptado';
            p.innerText = message;
            errores.push(message)
        }
        function setSuccess(input, message) {
            input.classList.remove('input-form-no-aceptado')
            input.classList.add('input-form-aceptado')     
        }
        if (errores.length === 0) {
            form.submit()
        }
    }
)

}