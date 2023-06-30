var queryString = window.location.search;
var urlParametros = new URLSearchParams(queryString);
var id_contacto_url = urlParametros.get('id');
//Crear trabajador
function crearTrabajador() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    //Variables con los datos de formulario para crear trabajador
    var txt_id_trabajador = document.getElementById("txt_id_trabajador").value;
    var txt_nombre = document.getElementById("txt_nombre").value;
    var seleccion_sexo = document.getElementById("lista-sexo").value;
    var txt_fecha_nacimiento = document.getElementById("txt_fecha_nacimiento").value;
    var txt_direccion = document.getElementById("txt_direccion").value;
    var txt_telefono = document.getElementById("txt_telefono").value;

    var raw = JSON.stringify({
        "rut": txt_id_trabajador,
        "nombre": txt_nombre,
        "sexo": seleccion_sexo,
        "fecha_nacimiento": txt_fecha_nacimiento,
        "direccion": txt_direccion,
        "telefono": txt_telefono

    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/api/trabajador", requestOptions)
        .then(response => {
            if (response.ok) {
                alert("Trabajador agregado");
                window.location.href = "listar-trabajadores.html";
            }
        })
}
// Lista de trabajadores
function listarTrabajadores() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("http://localhost:3000/api/trabajador?_size=100", requestOptions)
        .then(response => response.json())
        .then((json) => {
            json.forEach(completarFila);
            return json;

        })
        .then((json) => {
            $("#tbl_trabajadores").DataTable();
        })
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

//Completar fila
function completarFila(element, index, arr) {
    if (element.rut === id_contacto_url) {
        arr[index] = document.querySelector('#tbl_trabajadores tbody').innerHTML +=
            `<tr>
          <td>${element.rut}</td>
          <td>${element.nombre}</td>
          <td>${element.sexo}</td>
          <td>${formatDate(element.fecha_nacimiento)}</td>
          <td>${element.direccion}</td>
          <td>${element.telefono}</td>

    <td> <a href='../menu-personal/actualizar-datos.html?id=${element.rut}'> <img src='../img/actualizar_24x24.png'></a> </td>
      </tr>`
    }
}

function formatDate(date) {
    const fecha = new Date(date);

    const day = fecha.getDate() < 10 ? `0${fecha.getDate()}` : fecha.getDate();
    const month = fecha.getMonth() < 10 ? `0${fecha.getMonth() + 1}` : fecha.getMonth() + 1;

    return `${day}-${month}-${fecha.getFullYear()}`;
}

function formatDate2(date) {
    const fecha = new Date(date);

    const day = fecha.getDate() < 10 ? `0${fecha.getDate()}` : fecha.getDate();
    const month = fecha.getMonth() < 10 ? `0${fecha.getMonth() + 1}` : fecha.getMonth() + 1;

    return `${fecha.getFullYear()}-${month}-${day}`;
}
// Consultar datos del trabajador
function consultarDatostrabajador(id_trabajador) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://localhost:3000/api/trabajador/" + id_trabajador, requestOptions)
        .then(response => response.json())
        .then((json) => json.forEach(completarFormulario))
        .catch(error => console.log('error', error));
}
//Completar formulario
function completarFormulario(element) {
    var id_trabajador = element.rut;
    var nombre = element.nombre;
    var sexo = element.sexo;
    var fecha_nacimiento = formatDate2(element.fecha_nacimiento);
    var direccion = element.direccion;
    var telefono = element.telefono;

    document.getElementById("txt_id_trabajador").value = id_trabajador;
    document.getElementById("txt_nombre").value = nombre;
    document.getElementById("lista-sexo").value = sexo;
    document.getElementById("txt_fecha_nacimiento").value = fecha_nacimiento;
    document.getElementById("txt_direccion").value = direccion;
    document.getElementById("txt_telefono").value = telefono;

}

//Obtenemos los datos del trabajador a actualizar
function obtenerIDtrabajadorActualizar() {
    var queryString = window.location.search;
    var urlParametros = new URLSearchParams(queryString);
    var id_trabajador_url = urlParametros.get('id');

    document.getElementById("txt_id_trabajador").value = id_trabajador_url;
    consultarDatostrabajador(id_trabajador_url);

}
// Actualizamos los datos del trabajador con el método patch
function actualizarTrabajador() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var txt_id_trabajador = document.getElementById("txt_id_trabajador").value;
    var txt_nombre = document.getElementById("txt_nombre").value;
    var txt_sexo = document.getElementById("lista-sexo").value;
    var txt_fecha_nacimiento = document.getElementById("txt_fecha_nacimiento").value;
    var txt_direccion = document.getElementById("txt_direccion").value;
    var txt_telefono = document.getElementById("txt_telefono").value;

    var raw = JSON.stringify({
        "rut": txt_id_trabajador,
        "nombre": txt_nombre,
        "sexo": txt_sexo,
        "fecha_nacimiento": txt_fecha_nacimiento,
        "direccion": txt_direccion,
        "telefono": txt_telefono

    });

    var requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/api/trabajador/" + txt_id_trabajador, requestOptions)
        .then(response => {
            if (response.ok) {
                alert("Trabajador actualizado");
                window.location.href = "../menu-personal/listar-datos.html?id="+id_contacto_url;
            }

        })
}

//Obtenemos id del trabajador a eliminar
function obtenerIDTrabajadorEliminar() {
    //Utilizamos search para acceder a las variables recibidas mediante URL
    var queryString = window.location.search;
    //Extraemos los parámetros
    var urlParametros = new URLSearchParams(queryString);
    //Creamos variable con el id del trabajador
    var id_trabajador_url = urlParametros.get('id');
    var nombre_url = urlParametros.get('nombre');

    //Agregamos ID a campo oculto
    document.getElementById('hdn_id_trabajador').value = id_trabajador_url;
    //Mostramos mensaje de confirmación
    var mensaje = "¿" + "Desea eliminar al trabajador " + nombre_url + "?";
    document.getElementById("alt_eliminacion").innerHTML = mensaje;
}
// Eliminar trabajador
function eliminarTrabajador() {
    //Obtenemos id a eliminar
    var id_trabajador_eliminar = document.getElementById('hdn_id_trabajador').value;

    var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };

    fetch("http://localhost:3000/api/trabajador/" + id_trabajador_eliminar, requestOptions)
        .then(response => {
            if (response.ok) {
                alert("Trabajador eliminado");
            } else {
                alert("Trabajador no puede ser eliminado. El registro está siendo utilizado")
            }
            window.location.href = "listar-trabajadores.html";

        })
}
function enviarUrlPersonales() {
    var queryString = window.location.search;
    var urlParametros = new URLSearchParams(queryString);
    var id_contacto_url = urlParametros.get('id');
    window.location.href = "C:/xampp/htdocs/Proyectos/yury/portada/portada.html?id="+ id_contacto_url;

}

