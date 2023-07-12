/**
Clase encargada de gestionar los trabajadores de la empres.
/
class Trabajadores Manager {
*/
var queryString = window.location.search;
var urlParametros = new URLSearchParams(queryString);
var iduser = urlParametros.get('iduser');
var caracteres_especiales = /^[a-z ñÑ A-ZáéíóúÁÉÍÓÚ]{1,55}$/;
var rutValido = /^\d{1,2}\d{6}-\d{1}k?$/i;
// Agrupa las funciones para agregar un nuevo trabajador
function crearTrabajador() {
    this.crearTrabajadorTabla();
    this.crearTrabajadorUsuario();
}
/**
 * Crea un trabajador con base en los datos de la tabla trabajador
 */
function crearTrabajadorTabla() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Variables con los datos de formulario para crear trabajador
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

    fetch("http://localhost:3000/api/trabajador", requestOptions).then(response => {
        if (response.ok) {
            alert("Trabajador agregado");
        }
    })
}
/**
 * Crea un trabajador con base en los datos de la tabla usuario.
 */
function crearTrabajadorUsuario() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Variables con los datos de formulario para crear trabajador
    var txt_id_trabajador = document.getElementById("txt_id_trabajador").value;
    var txt_nombre = document.getElementById("txt_nombre").value;
    var seleccion_perfil = document.getElementById("seleccion-perfil").value;
    var contraseña = document.getElementById("contraseña").value;

    var raw = JSON.stringify({"nombre_usuario": txt_nombre, "rut_trabajador": txt_id_trabajador, "perfil_usuario": seleccion_perfil, "contrasena_usuario": contraseña});
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch("http://localhost:3000/api/usuario", requestOptions).then(response => {
        if (response.ok) {
            window.location.href = "listar-trabajadores.html?iduser=" + iduser;
        }
    })

}
// Lista de trabajadores
/**
 * * Obtiene la lista de trabajadores para el perfil de usuario Jefe de RRHH.
 */
function listarTrabajadoresJefe() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({"query": "select dl.cargo_trabajador, dl.area_trabajador, dl.departamento_trabajador, dl.rut_trabajador,t.rut, t.nombre, t.sexo, t.fecha_nacimiento, t.direccion, t.telefono FROM datos_laborales dl, trabajador t WHERE rut_trabajador=rut"});

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/dynamic", requestOptions).then(response => response.json()).then((json) => {
        json.forEach(completarFilaJefe);
        return json;
    }).then((json) => {
        $("#tbl_trabajadores").DataTable();
    }).then(result => console.log(result)).catch(error => console.log('error', error));
}
// Completar fila
/**
Completa una fila de la tabla de trabajadores para el perfil de usuario Jefe de RRHH.
*/
function completarFilaJefe(element, index, arr) {
    arr[index] = document.querySelector('#tbl_trabajadores tbody').innerHTML += `<tr>
       <td>${
        element.rut
    }</td>
       <td>${
        element.nombre
    }</td>
       <td>${
        element.sexo
    }</td>
       <td>${
        formatDate(element.fecha_nacimiento)
    }</td>
       <td>${
        element.direccion
    }</td>
       <td>${
        element.telefono
    }</td>
       <td>${
        element.cargo_trabajador
    }</td>
       <td>${
        element.area_trabajador
    }</td>
       <td>${
        element.departamento_trabajador
    }</td>
       <td> <a href='eliminar-trabajador.html?id=${
        element.rut
    }&nombre=${
        element.nombre
    }&iduser=${iduser}'>   <img alt='Eliminar trabajador' width=40 height=40 src='../img/eliminar_24x24.png'></a> </td>
 <td> <a href='actualizar-trabajador.html?id=${
        element.rut
    }&iduser=${iduser}'> <img src='../img/actualizar_24x24.png'></a> </td>
 <td><a href='../datos-laborales/listar-datos-laborales.html?id=${
        element.rut
    }&iduser=${iduser}'> <img alt='Datos laborales' width=50 height=50  src='../img/resultados_640x640.png'></a> </td>
 <td><a href='../contacto-emergencia/listar-contacto-emergencia.html?id=${
        element.rut
    }&iduser=${iduser}'> <img src='../img/emergencia_48x48.png'></a></td>
 <td><a href='../carga-familiar/listar-carga-familiar.html?id=${
        element.rut
    }&iduser=${iduser}'> <img src='../img/carga_familiar_48x48.png'></a> </td>
 </td>
   </tr>`
}

function listarTrabajadores() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("http://localhost:3000/api/trabajador?_size=100", requestOptions).then(response => response.json()).then((json) => {
        json.forEach(completarFila);
        return json;

    }).then((json) => {
        $("#tbl_trabajadores").DataTable();
    }).then(result => console.log(result)).catch(error => console.log('error', error));
}

// Completar fila
function completarFila(element, index, arr) {
    arr[index] = document.querySelector('#tbl_trabajadores tbody').innerHTML += `<tr>
       <td>${
        element.rut
    }</td>
       <td>${
        element.nombre
    }</td>
       <td>${
        element.sexo
    }</td>
       <td>${
        formatDate(element.fecha_nacimiento)
    }</td>
       <td>${
        element.direccion
    }</td>
       <td>${
        element.telefono
    }</td>
       <td> <a href='eliminar-trabajador.html?id=${
        element.rut
    }&nombre=${
        element.nombre
    }&iduser=${iduser}'>   <img alt='Eliminar trabajador' width=40 height=40 src='../img/eliminar_24x24.png'></a> </td>
 <td> <a href='actualizar-trabajador.html?id=${
        element.rut
    }&iduser=${iduser}'> <img src='../img/actualizar_24x24.png'></a> </td>
 <td><a href='../datos-laborales/listar-datos-laborales.html?id=${
        element.rut
    }&iduser=${iduser}'> <img alt='Datos laborales' width=50 height=50  src='../img/resultados_640x640.png'></a> </td>
 <td><a href='../contacto-emergencia/listar-contacto-emergencia.html?id=${
        element.rut
    }&iduser=${iduser}'> <img src='../img/emergencia_48x48.png'></a></td>
 <td><a href='../carga-familiar/listar-carga-familiar.html?id=${
        element.rut
    }&iduser=${iduser}'> <img src='../img/carga_familiar_48x48.png'></a> </td>
 </td>
   </tr>`
}
/**Da formato a la fecha */
function formatDate(date) {
    const fecha = new Date(date);

    const day = fecha.getDate() < 10 ? `0${
        fecha.getDate()
    }` : fecha.getDate();
    const month = fecha.getMonth() < 10 ? `0${
        fecha.getMonth() + 1
    }` : fecha.getMonth() + 1;

    return `${day}-${month}-${
        fecha.getFullYear()
    }`;
}

function formatDate2(date) {
    const fecha = new Date(date);

    const day = fecha.getDate() < 10 ? `0${
        fecha.getDate()
    }` : fecha.getDate();
    const month = fecha.getMonth() < 10 ? `0${
        fecha.getMonth() + 1
    }` : fecha.getMonth() + 1;

    return `${
        fecha.getFullYear()
    }-${month}-${day}`;
}

// Consultar datos del trabajador
function consultarDatostrabajador(id_trabajador) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://localhost:3000/api/trabajador/" + id_trabajador, requestOptions).then(response => response.json()).then((json) => json.forEach(completarFormulario)).catch(error => console.log('error', error));
}
// Completar formulario
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
function consultarDatosUsuario(id_trabajador) {
    var username = id_trabajador
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "query": "select id_usuario, contrasena_usuario, perfil_usuario, estado FROM usuario WHERE rut_trabajador='" + username + "'"
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/dynamic", requestOptions).then(response => response.json()).then((json) => {
        json.forEach(completarFormularioUsuario);
        console.log(json);
    })

}
// Completar formulario
function completarFormularioUsuario(element) {
    var perfil = element.perfil_usuario;
    var contraseña = element.contrasena_usuario;
    var estado = element.estado;
    document.getElementById("contraseña").value = contraseña;
    document.getElementById("lista-estado").value = estado;
    id_usuario_guardar = element.id_usuario;
    perfil_usuario_guardar = perfil;

}

// Obtenemos los datos del trabajador a actualizar
function obtenerIDtrabajadorActualizar() {
    var queryString = window.location.search;
    var urlParametros = new URLSearchParams(queryString);
    var id_trabajador_url = urlParametros.get('id');

    document.getElementById("txt_id_trabajador").value = id_trabajador_url;
    consultarDatostrabajador(id_trabajador_url);
    consultarDatosUsuario(id_trabajador_url);

}
// Actualizamos los datos del trabajador con el método patch
function actualizarTrabajador() {
    this.actualizarTrabajadorPrincipal();
    this.actualizarContraseñaEstado();
}
function actualizarTrabajadorPrincipal() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var txt_id_trabajador = document.getElementById("txt_id_trabajador").value;
    var txt_nombre = document.getElementById("txt_nombre").value;
    var txt_sexo = document.getElementById("lista-sexo").value;
    var txt_fecha_nacimiento = document.getElementById("txt_fecha_nacimiento").value;
    var txt_direccion = document.getElementById("txt_direccion").value;
    var txt_telefono = document.getElementById("txt_telefono").value;
    var estado_cuenta = document.getElementById("lista-estado").value;

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

    fetch("http://localhost:3000/api/trabajador/" + txt_id_trabajador, requestOptions).then(response => {
        if (response.ok) {
            alert("Trabajador actualizado");
        }

    })
}
function actualizarContraseñaEstado() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var txt_id_trabajador = document.getElementById("txt_id_trabajador").value;
    var txt_nombre = document.getElementById("txt_nombre").value;
    var contraseña_actualizada = document.getElementById("contraseña").value;
    var estado_usuario = document.getElementById("lista-estado").value;

    var raw = JSON.stringify({
        "id_usuario": id_usuario_guardar,
        "nombre_usuario": txt_nombre,
        "rut_trabajador": txt_id_trabajador,
        "perfil_usuario": perfil_usuario_guardar,
        "contrasena_usuario": contraseña_actualizada,
        "estado": estado_usuario
    });

    var requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/api/usuario/" + id_usuario_guardar, requestOptions).then(response => {
        if (response.ok) {
            window.location.href = "listar-trabajadores.html?iduser=" + iduser;
        }

    })

}
// Obtenemos id del trabajador a eliminar
function obtenerIDTrabajadorEliminar() { // Utilizamos search para acceder a las variables recibidas mediante URL
    var queryString = window.location.search;
    // Extraemos los parámetros
    var urlParametros = new URLSearchParams(queryString);
    // Creamos variable con el id del trabajador
    var id_trabajador_url = urlParametros.get('id');
    var nombre_url = urlParametros.get('nombre');

    // Agregamos ID a campo oculto
    document.getElementById('hdn_id_trabajador').value = id_trabajador_url;
    // Mostramos mensaje de confirmación
    var mensaje = "¿" + "Desea eliminar al trabajador " + nombre_url + "?";
    document.getElementById("alt_eliminacion").innerHTML = mensaje;
}
// Eliminar trabajador
function eliminarTrabajador() { // Obtenemos id a eliminar
    var id_trabajador_eliminar = document.getElementById('hdn_id_trabajador').value;

    var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };

    fetch("http://localhost:3000/api/trabajador/" + id_trabajador_eliminar, requestOptions).then(response => {
        if (response.ok) {
            alert("Trabajador eliminado");
        } else {
            alert("Trabajador no puede ser eliminado. El registro está siendo utilizado")
        }
        window.location.href = "listar-trabajadores.html?iduser=" + iduser;

    })
}

function filtroAcepta() {
    var queryString = window.location.search;
    var urlParametros = new URLSearchParams(queryString);
    var id_trabajador_url = urlParametros.get('iduser');
    window.location.href = "C:/xampp/htdocs/Proyectos/yury/index-jefe.html?iduser=" + id_trabajador_url;
}
function filtroInicio() {
    var queryString = window.location.search;
    var urlParametros = new URLSearchParams(queryString);
    var id_trabajador_url = urlParametros.get('iduser');
    window.location.href = "C:/xampp/htdocs/Proyectos/yury/trabajador/listar-trabajadores.html?iduser=" + id_trabajador_url;
}
function validarCamposCrear() {
    var txt_id_trabajador = document.getElementById("txt_id_trabajador").value;
    var txt_nombre = document.getElementById("txt_nombre").value;
    var seleccion_sexo = document.getElementById("lista-sexo").value;
    var txt_fecha_nacimiento = document.getElementById("txt_fecha_nacimiento").value;
    var txt_direccion = document.getElementById("txt_direccion").value;
    var txt_telefono = document.getElementById("txt_telefono").value;
    var txt_id_trabajador = document.getElementById("txt_id_trabajador").value;
    var txt_nombre = document.getElementById("txt_nombre").value;
    var seleccion_perfil = document.getElementById("seleccion-perfil").value;
    var contraseña = document.getElementById("contraseña").value;

    if (txt_id_trabajador === "" || ! rutValido.test(txt_id_trabajador)) {
        alert("Complete RUT antes de enviar el formulario. Ingrese el rut sin puntos y con guión");
    } else {
        if (txt_nombre === "" || ! caracteres_especiales.test(txt_nombre)) {
            alert("Ingrese su nombre completo antes de enviar el formulario. No utilice números ni caracteres especiales");
        } else {
            if (seleccion_sexo === "null") {
                alert("Seleccione una opción de sexo antes de enviar el formulario");
            } else {
                if (txt_fecha_nacimiento === "") {
                    alert("Seleccione una fecha antes de enviar el formulario")
                } else {
                    if (txt_direccion === "") {
                        alert("Ingrese una dirección antes de enviar el formulario.");
                    } else {
                        if (txt_telefono === "0" || txt_telefono < 0) {
                            alert("Ingrese un número de teléfono");
                        } else {
                            if (seleccion_perfil === "null") {
                                alert("Seleccione una opción de tipo de trabajador antes de enviar el formulario");
                            } else {
                                if (contraseña === "") {
                                    alert("Ingrese una contraseña antes de enviar el formulario.");
                                } else {
                                    this.crearTrabajador();
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
