window.onload = function () {
    form = document.getElementById("form");
    botonSubmit = document.getElementById("botonEnviar");

    form.addEventListener("submit", (e) => {
        e.preventDefault()
        
        // obtener campos del formulario
        const form = document.getElementById('form'); 
        const email = document.getElementById('email');
        const contrasenia = document.getElementById('contrasenia');
        const contraseniaValida =  /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/
        for (let i = 0; i <  document.querySelectorAll('p.form-error').length; i++) {
            document.querySelectorAll('p.form-error')[i].innerText = ''
        }

        errores = []
 
        if (email.value === '') {
            setError(email, "Este campo es obligatorio")
        }else if(!isEmail(email.value)){
            setError(email, "Debe igresar un email válido(Ej: usuario@dominio.com)")
        }else{
            setSuccess(email)
        }

        if (contrasenia.value === '') {
            setError(contrasenia, "Este campo es obligatorio")
        }else{
            setSuccess(contrasenia) 
        }

        function isEmail(email){
            return /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(email);
        }
        function setError(input, message) {
            const formControl = input.parentElement;
            const p = formControl.querySelector('p');
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