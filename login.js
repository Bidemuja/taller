function login() {
    var username = document.getElementById("username").value;
    console.log(username);
    var contraseña = document.getElementById("password").value;
    console.log(contraseña);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "query": "select COUNT(*) as cuenta FROM usuario WHERE rut_trabajador='" + username + "'AND contrasena_usuario='" + contraseña + "'"
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
function aceptaLogin(element,index,arr) {
    var username= document.getElementById("username").value;
    var ele = arr[0]; 
    if (ele.cuenta  === 0) {
        console.log(ele.cuenta);
        alert("error")
    } else {
        window.location.href = "trabajador/listar-trabajadores.html?id="+username;
    }

}
