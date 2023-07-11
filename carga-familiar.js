var queryString = window.location.search;
var urlParametros = new URLSearchParams(queryString);
var id_contacto_url = urlParametros.get('id');
var iduser = urlParametros.get('iduser');

    var caracteres_especiales = /^[a-z ñÑ A-ZáéíóúÁÉÍÓÚ]{1,55}$/;
    var rutValido = /^\d{1,2}\d{6}-\d{1}k?$/i;


// Lista de Cargas familiares
function listarCargasFamiliares() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("http://localhost:3000/api/carga_familiar?_size=100", requestOptions)
        .then(response => response.json())
        .then((json) => {
            json.forEach(completarFila);
            return json;
        })
        .then((json) => {
            $("#tbl_cargas_familiares").DataTable();
        })
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

//Completar fila cargas
function completarFila(element, index, arr) {
    if (element.rut_trabajador === id_contacto_url) {
        arr[index] = document.querySelector('#tbl_cargas_familiares tbody').innerHTML +=
            `<tr>
          <td>${element.rut_carga}</td>
          <td>${element.nombre_carga}</td>
          <td>${element.sexo_carga}</td>
          <td>${element.parentesco_carga}</td>
          <td>
    <a href='eliminar-carga-familiar.html?id=${element.rut_carga}&nombre=${element.nombre_carga}&idtrab=${element.rut_trabajador}&iduser=${iduser}'>   <img src='../img/eliminar_24x24.png'></a> 
    <a href='actualizar-carga-familiar.html?id=${element.rut_carga}&idtrab=${element.rut_trabajador}&iduser=${iduser}'> <img src='../img/actualizar_24x24.png'></a> 
    </td>
     </tr>`
    }
}

//Agregar nueva carga familiar
function crearCargaFamiliar() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    //Variables con los datos de formulario para crear trabajador
    var txt_rut_carga = document.getElementById("txt_rut_carga").value;
    var txt_nombre_carga = document.getElementById("txt_nombre_carga").value;
    var seleccion_sexo_carga = document.getElementById("lista-sexo").value;
    var seleccion_parentesco_carga = document.getElementById("lista-parentesco").value;


    var raw = JSON.stringify({
        "rut_carga": txt_rut_carga,
        "rut_trabajador": id_contacto_url,
        "nombre_carga": txt_nombre_carga,
        "sexo_carga": seleccion_sexo_carga,
        "parentesco_carga": seleccion_parentesco_carga,

    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/api/carga_familiar", requestOptions)
        .then(response => {
            if (response.ok) {
                alert("Carga familiar agregada");
                window.location.href = "listar-carga-familiar.html?id=" + id_contacto_url+"&iduser="+iduser;
            }
        })
}

// Consultar datos de carga familiar
function consultarDatosCargaFamiliar(rut_carga) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://localhost:3000/api/carga_familiar/" + rut_carga, requestOptions)
        .then(response => response.json())
        .then((json) => json.forEach(completarFormulario))
        .catch(error => console.log('error', error));
}
//Completar formulario 
function completarFormulario(element) {
    var rut_carga = element.rut_carga;
    var nombre_carga = element.nombre_carga;
    var sexo_carga = element.sexo_carga;
    var parentesco_carga = element.parentesco_carga;

    document.getElementById("txt_rut_carga").value = rut_carga;
    document.getElementById("txt_nombre_carga").value = nombre_carga;
    document.getElementById("lista-sexo").value = sexo_carga;
    document.getElementById("lista-parentesco").value = parentesco_carga;

}

//Obtenemos los datos de la carga familiar a actualizar
function obtenerIDCargaActualizar() {
    var queryString = window.location.search;
    var urlParametros = new URLSearchParams(queryString);
    var id_carga_url = urlParametros.get('id');

    document.getElementById("txt_rut_carga").value = id_carga_url;
    consultarDatosCargaFamiliar(id_carga_url);
}
// Actualizamos los datos de la carga familiar con el método patch
function actualizarCargaFamiliar() {

    var queryString = window.location.search;
    var urlParametros = new URLSearchParams(queryString);
    var rut_trabajador_url = urlParametros.get('idtrab');

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var txt_rut_carga = document.getElementById("txt_rut_carga").value;
    var txt_nombre_carga = document.getElementById("txt_nombre_carga").value;
    var txt_sexo_carga = document.getElementById("lista-sexo").value;
    var txt_parentesco_carga = document.getElementById("lista-parentesco").value;


    var raw = JSON.stringify({
        "rut_carga": txt_rut_carga,
        "rut_trabajador": rut_trabajador_url,
        "nombre_carga": txt_nombre_carga,
        "sexo_carga": txt_sexo_carga,
        "parentesco_carga": txt_parentesco_carga,

    });

    var requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/api/carga_familiar/" + txt_rut_carga, requestOptions)
        .then(response => {
            if (response.ok) {
                alert("Carga familiar actualizada");
            }
            window.location.href = "listar-carga-familiar.html?id=" + rut_trabajador_url+"&iduser="+iduser;
        })
}

//Obtenemos id de la carga familiar a eliminar
function obtenerIDCargaEliminar() {
    //Utilizamos search para acceder a las variables recibidas mediante URL
    var queryString = window.location.search;
    //Extraemos los parámetros
    var urlParametros = new URLSearchParams(queryString);
    //Creamos variable con el id del trabajador
    var rut_carga_url = urlParametros.get('id');
    var nombre_url = urlParametros.get('nombre');

    //Agregamos ID a campo oculto
    document.getElementById('hdn_rut_carga').value = rut_carga_url;
    //Mostramos mensaje de confirmación
    var mensaje = "¿" + "Desea eliminar a " + nombre_url + " como carga familiar?";
    document.getElementById("alt_eliminacion").innerHTML = mensaje;
}
// Eliminar carga familiar
function eliminarCargaFamiliar() {

    var queryString = window.location.search;
    var urlParametros = new URLSearchParams(queryString);
    var rut_trabajador_url = urlParametros.get('idtrab');
  
    var rut_carga_eliminar = document.getElementById('hdn_rut_carga').value;

    var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };

    fetch("http://localhost:3000/api/carga_familiar/" + rut_carga_eliminar, requestOptions)
        .then(response => {
            if (response.ok) {
                alert("Carga familiar eliminada");
                window.location.href = "listar-carga-familiar.html?id=" + rut_trabajador_url+"&iduser="+iduser;
            } else {
                alert("Carga familiar no puede ser eliminada.")
            }

        })
}

function enviarUrlCargasFamiliares() {
    var queryString = window.location.search;
    var urlParametros = new URLSearchParams(queryString);
    var id_contacto_url = urlParametros.get('id');
    window.location.href = "../carga-familiar/agregar-carga-familiar.html?id="+ id_contacto_url+"&iduser="+iduser;

}
function filtroInicio(){
    var queryString = window.location.search;
    var urlParametros = new URLSearchParams(queryString);
    var id_trabajador_url = urlParametros.get('iduser');
    window.location.href= "C:/xampp/htdocs/Proyectos/yury/trabajador/listar-trabajadores.html?iduser="+id_trabajador_url;
}

function validarCamposCrear() {
    var txt_rut_carga = document.getElementById("txt_rut_carga").value;
    var txt_nombre_carga = document.getElementById("txt_nombre_carga").value;
    var seleccion_sexo_carga = document.getElementById("lista-sexo").value;
    var seleccion_parentesco_carga = document.getElementById("lista-parentesco").value;
    
    if (txt_rut_carga === "" || !rutValido.test(txt_rut_carga)) {
        alert("Complete RUT antes de enviar el formulario. Ingrese el rut sin puntos y con guión");
    } else {
        if (txt_nombre_carga === "" || ! caracteres_especiales.test(txt_nombre_carga)) {
            alert("Ingrese su nombre completo antes de enviar el formulario. No utilice números ni caracteres especiales");
        } else {
            if (seleccion_sexo_carga === "null") {
                alert("Seleccione una opción de sexo antes de enviar el formulario");
            } else {
                if (seleccion_parentesco_carga === "null") {
                    alert("Seleccione una opción de parentesco antes de enviar el formulario");
                } else {
                    crearCargaFamiliar();
                }
            }
        }
    }
}
