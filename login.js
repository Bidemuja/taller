var username = document.getElementById("username").value;
function login() {
    var username = document.getElementById("username").value;
    var contraseña = document.getElementById("password").value;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "query": "select perfil_usuario, COUNT(*) as cuenta FROM usuario WHERE rut_trabajador='" + username + "'AND contrasena_usuario='" + contraseña + "'"
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/dynamic", requestOptions)
        .then(response => response.json())
        .then((json) => {
            json.forEach(aceptaLogin);
            console.log(json);
        })

}
function aceptaLogin(element, index, arr) {
    var username = document.getElementById("username").value;
    var ele = arr[index];
    if (ele.cuenta === 0) {
        console.log(ele.cuenta);
        alert("Verifique sus datos de ingreso")
    }

    if (ele.cuenta === 1 && ele.perfil_usuario === "Recursos Humanos") {
        console.log(ele.cuenta);
        console.log(ele.perfil_usuario);
        window.location.href = "trabajador/listar-trabajadores.html?id=" + username + "&rrhh";
    }
    if (ele.cuenta === 1 && ele.perfil_usuario === "Trabajador") {
        console.log(ele.cuenta);
        console.log(ele.perfil_usuario);
        window.location.href = "portada/portada.html?id=" + username + "&trabajador";
    }

}
