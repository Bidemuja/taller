function redirectTo(url) {
    window.open(url, "_blank");
}
function enviarUrlPersonales() {
    var queryString = window.location.search;
    var urlParametros = new URLSearchParams(queryString);
    var id_contacto_url = urlParametros.get('id');
    window.location.href ="../menu_trabajador/menu-personal/listar-datos.html?id=" + id_contacto_url;

}
function enviarUrlCargas() {
    var queryString = window.location.search;
    var urlParametros = new URLSearchParams(queryString);
    var id_contacto_url = urlParametros.get('id');
    window.location.href ="../menu_trabajador/menu-carga/listar-carga.html?id=" + id_contacto_url;

}
function enviarUrlContacto() {
    var queryString = window.location.search;
    var urlParametros = new URLSearchParams(queryString);
    var id_contacto_url = urlParametros.get('id');
    window.location.href ="../menu_trabajador/menu-contacto/listar-contacto.html?id=" + id_contacto_url;

}