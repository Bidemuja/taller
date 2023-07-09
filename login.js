var username = document.getElementById("username").value;
function login() {
    var username = document.getElementById("username").value;
    var contraseña = document.getElementById("password").value;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "query": "select perfil_usuario, estado, COUNT(*) as cuenta FROM usuario WHERE rut_trabajador='" + username + "'AND contrasena_usuario='" + contraseña + "'"
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

    if (ele.cuenta === 1 && ele.perfil_usuario === "Recursos Humanos" && ele.estado === "Habilitado") {
        window.location.href = "trabajador/listar-trabajadores.html?iduser="+username+"id=" + username + "&rrhh";
    }
    if (ele.cuenta === 1 && ele.perfil_usuario === "Trabajador" && ele.estado === "Habilitado") {
        window.location.href = "portada/portada.html?iduser="+username+"&id=" + username + "&trabajador";
    }
    if (ele.cuenta === 1 && ele.perfil_usuario === "Jefe RRHH" && ele.estado === "Habilitado") {
        window.location.href = "trabajador/listar-trabajadores.html?iduser="+username+"&id=" + username + "&Jefe-RRHH";
    }
    if (ele.cuenta === 1 && ele.estado === "Inhabilitado" && (ele.perfil_usuario === "Jefe RRHH" || ele.perfil_usuario === "Trabajador" || ele.perfil_usuario === "Recursos Humanos")) {
        alert("Su cuenta se encuentra desactivada. Contáctese con el Departamento de Recursos Humanos");
    }
}
function aceptaFiltrar(element, index, arr) {
    var queryString = window.location.search;
    var urlParametros = new URLSearchParams(queryString);
    var id_trabajador_url = urlParametros.get('iduser');
    var username2 = id_trabajador_url;
    var contraseña = document.getElementById("password").value;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "query": "select perfil_usuario, estado, COUNT(*) as cuenta FROM usuario WHERE rut_trabajador='" + username2 + "'AND contrasena_usuario='" + contraseña + "'"
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
            json.forEach(aceptaFiltro);
            console.log(json);
        })

}
function aceptaFiltro(element, index, arr) {
    var queryString = window.location.search;
    var urlParametros = new URLSearchParams(queryString);
    var id_trabajador_url = urlParametros.get('iduser');
    var username2 = id_trabajador_url;
    
    var ele = arr[index];
    if (ele.cuenta === 0) {
        console.log(ele.cuenta);
        alert("Verifique su contraseña")
    }
    if (ele.perfil_usuario === "Jefe RRHH" && ele.estado === "Habilitado") {
        window.location.href = "trabajador/listar-trabajadores-jefe.html?iduser=" + username2 + "&JefeRRHH";
    }
}
function filtroInicio(){
    var queryString = window.location.search;
    var urlParametros = new URLSearchParams(queryString);
    var id_trabajador_url = urlParametros.get('iduser');
    window.location.href= "C:/xampp/htdocs/Proyectos/yury/trabajador/listar-trabajadores.html?iduser="+id_trabajador_url;
}

