var queryString = window.location.search;
var urlParametros = new URLSearchParams(queryString);
var id_trabajador_contacto_url = urlParametros.get('id');
var iduser = urlParametros.get('iduser');

var caracteres_especiales = /^[a-z ñÑ A-ZáéíóúÁÉÍÓÚ]{1,55}$/;
var rutValido = /^\d{1,2}\d{6}-\d{1}k?$/i;

// Listar contactos de emergencia
function listarContactoEmergencia() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("http://localhost:3000/api/contacto_emergencia?_size=100", requestOptions).then(response => response.json()).then((json) => {
        json.forEach(completarFila);
        return json;
    }).then((json) => {
        $("#tbl_contacto_emergencia").DataTable();
    }).then(result => console.log(result)).catch(error => console.log('error', error));
}

// Completar fila contactos emergencia
function completarFila(element, index, arr) {
    if (element.rut_trabajador === id_trabajador_contacto_url) {
        arr[index] = document.querySelector('#tbl_contacto_emergencia tbody').innerHTML += `<tr>
          <td>${
            element.rut_contacto
        }</td>
          <td>${
            element.nombre_contacto
        }</td>
          <td>${
            element.parentesco_contacto
        }</td>
          <td>${
            element.telefono_contacto
        }</td>
          <td>
    <a href='eliminar-contacto-emergencia.html?id=${
            element.rut_contacto
        }&nombre=${
            element.nombre_contacto
        }&rut=${
            element.rut_trabajador
        }&iduser=${iduser}'>   <img src='../img/eliminar_24x24.png'></a> 
    <a href='actualizar-contacto-emergencia.html?id=${
            element.rut_contacto
        }&idtrab=${
            element.rut_trabajador
        }&iduser=${iduser}'> <img src='../img/actualizar_24x24.png'></a> 
    </td>
  
      </tr>`
    }
}

// Agregar contacto emergencia
function crearContactoEmergencia() {
    var queryString = window.location.search;
    var urlParametros = new URLSearchParams(queryString);
    var rut_trabajador_url = urlParametros.get('id');

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Variables con los datos de formulario para crear trabajador
    var txt_rut_contacto = document.getElementById("txt_rut_contacto").value;
    var txt_nombre_contacto = document.getElementById("txt_nombre_contacto").value;
    var seleccion_parentesco_contacto = document.getElementById("lista-parentesco").value;
    var txt_telefono_contacto = document.getElementById("txt_telefono").value;

    var raw = JSON.stringify({
        "rut_contacto": txt_rut_contacto,
        "rut_trabajador": rut_trabajador_url,
        "nombre_contacto": txt_nombre_contacto,
        "parentesco_contacto": seleccion_parentesco_contacto,
        "telefono_contacto": txt_telefono_contacto

    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/api/contacto_emergencia", requestOptions).then(response => {
        if (response.ok) {
            alert("Contacto de emergencia agregado");
            window.location.href = "listar-contacto-emergencia.html?id=" + rut_trabajador_url + "&iduser=" + iduser;
        }
    })
}

// Consultar datos de contacto
function consultarDatosContactoEmergencia(rut_contacto) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://localhost:3000/api/contacto_emergencia/" + rut_contacto, requestOptions).then(response => response.json()).then((json) => json.forEach(completarFormulario)).catch(error => console.log('error', error));
}
// Completar formulario
function completarFormulario(element) {
    var rut_contacto = element.rut_contacto;
    var nombre_contacto = element.nombre_contacto;
    var parentesco_contacto = element.parentesco_contacto;
    var telefono = element.telefono_contacto;

    document.getElementById("txt_rut_contacto").value = rut_contacto;
    document.getElementById("txt_nombre_contacto").value = nombre_contacto;
    document.getElementById("lista-parentesco").value = parentesco_contacto;
    document.getElementById("txt_telefono").value = telefono;

}

// Obtenemos los datos del contacto a actualizar
function obtenerIDContactoActualizar() {
    var queryString = window.location.search;
    var urlParametros = new URLSearchParams(queryString);
    var id_contacto_url = urlParametros.get('id');

    document.getElementById("txt_rut_contacto").value = id_contacto_url;
    consultarDatosContactoEmergencia(id_contacto_url);
}
// Actualizamos los datos del contacto con el método patch
function actualizarContactoEmergencia() {

    var queryString = window.location.search;
    var urlParametros = new URLSearchParams(queryString);
    var rut_trabajador_url = urlParametros.get('idtrab');

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var txt_rut_contacto = document.getElementById("txt_rut_contacto").value;
    var txt_nombre_contacto = document.getElementById("txt_nombre_contacto").value;
    var txt_parentesco_contacto = document.getElementById("lista-parentesco").value;
    var txt_telefono = document.getElementById("txt_telefono").value;


    var raw = JSON.stringify({
        "rut_contacto": txt_rut_contacto,
        "rut_trabajador": rut_trabajador_url,
        "nombre_contacto": txt_nombre_contacto,
        "parentesco_contacto": txt_parentesco_contacto,
        "telefono_contacto": txt_telefono

    });

    var requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/api/contacto_emergencia/" + txt_rut_contacto, requestOptions).then(response => {
        if (response.ok) {
            alert("Contacto de emergencia actualizado");
            window.location.href = "listar-contacto-emergencia.html?id=" + rut_trabajador_url + "&iduser=" + iduser;
        }

    })
}

// Obtenemos id del contacto de emergencia a eliminar
function obtenerIDContactoEliminar() { // Utilizamos search para acceder a las variables recibidas mediante URL
    var queryString = window.location.search;
    // Extraemos los parámetros
    var urlParametros = new URLSearchParams(queryString);
    // Creamos variable con el id del contacto
    var rut_contacto_url = urlParametros.get('id');
    var nombre_url = urlParametros.get('nombre');
    var rut_trabajador = urlParametros.get('rut');

    // Agregamos ID a campo oculto
    document.getElementById('hdn_rut_contacto').value = rut_contacto_url;
    // Mostramos mensaje de confirmación
    var mensaje = "¿" + "Desea eliminar a " + nombre_url + " como contacto de emergencia?";
    document.getElementById("alt_eliminacion").innerHTML = mensaje;
}
// Eliminar contacto de emergencia
function eliminarContactoEmergencia() {
    var queryString = window.location.search;
    // Extraemos los parámetros
    var urlParametros = new URLSearchParams(queryString);
    // Creamos variable con el id del contacto
    var rut_trabajador = urlParametros.get('rut');
    // Obtenemos id a eliminar
    var rut_contacto_eliminar = document.getElementById('hdn_rut_contacto').value;

    var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };

    fetch("http://localhost:3000/api/contacto_emergencia/" + rut_contacto_eliminar, requestOptions).then(response => {
        if (response.ok) {
            alert("Contacto de emergencia eliminado");
            window.location.href = "listar-contacto-emergencia.html?id=" + rut_trabajador + "&iduser=" + iduser;
        } else {
            alert("Contacto de emergencia no puede ser eliminado.")
        }

    })
}

function agregarContactoEmergenciaRedireccion() {
    var queryString = window.location.search;
    var urlParametros = new URLSearchParams(queryString);
    var id_contacto_url = urlParametros.get('id');
    window.location.href = "C:/xampp/htdocs/Proyectos/yury/contacto-emergencia/agregar-contacto-emergencia.html?id=" + id_contacto_url + "&iduser=" + iduser;
}
function filtroInicio() {
    var queryString = window.location.search;
    var urlParametros = new URLSearchParams(queryString);
    var id_trabajador_url = urlParametros.get('iduser');
    window.location.href = "C:/xampp/htdocs/Proyectos/yury/trabajador/listar-trabajadores.html?iduser=" + id_trabajador_url + "&iduser=" + iduser;
}

function validarCamposCrear() {
    var txt_rut_contacto = document.getElementById("txt_rut_contacto").value;
    var txt_nombre_contacto = document.getElementById("txt_nombre_contacto").value;
    var seleccion_parentesco_contacto = document.getElementById("lista-parentesco").value;
    var txt_telefono_contacto = document.getElementById("txt_telefono").value;

    if (txt_rut_contacto === "" || ! rutValido.test(txt_rut_contacto)) {
        alert("Complete RUT antes de enviar el formulario. Ingrese el rut sin puntos y con guión");
    } else {
        if (txt_nombre_contacto === "" || ! caracteres_especiales.test(txt_nombre_contacto)) {
            alert("Ingrese su nombre completo antes de enviar el formulario. No utilice números ni caracteres especiales");
        } else {
            if (seleccion_parentesco_contacto === null) {
                alert("Seleccione una opción de sexo antes de enviar el formulario");
            } else {
                if (txt_telefono_contacto === "0" || txt_telefono_contacto < 0) {
                    alert("Ingrese un número de teléfono");
                } else {
                    crearContactoEmergencia();
                }
            }
        }
    }
}
function validarCamposActualizar() {
    var txt_telefono_contacto = document.getElementById("txt_telefono").value;
    if (txt_telefono_contacto === "0" || txt_telefono_contacto < 0) {
        alert("Ingrese un número de teléfono");
    } else {
        actualizarContactoEmergencia();
    }
}
