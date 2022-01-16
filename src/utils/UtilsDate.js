export function getDateNow() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    return today;
}

export function formatDate(date) {
    let dia = '';
    if (date.getDate() < 10) {
        dia = '0'+date.getDate();
    } else {
        dia = date.getDate();
    } 
    return dia + "/" + (date.getMonth() + 1) + "/" + (date.getYear() + 1900);
}