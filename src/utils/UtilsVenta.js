import { formatDate } from "./UtilsDate";
 
export function getVentasByRoom(numeroRoom, ventas) {
    return ventas.filter( venta => {
       return venta.numeroHabitacion === numeroRoom &&
                !venta.cancelado && !venta.pagado
      });
 }

 export function createVentaObjeto(roomNumber, productName, productPrice, productQuantity, data) {
    let totalPrice = productPrice * productQuantity;
     return  {
        numeroHabitacion: roomNumber,
        fecha: formatDate(data),
        producto: productName,
        precio: productPrice,
        cantidad: productQuantity,
        total: totalPrice,
        pagado: false,
        cancelado: false
    }
}

 export function actualizatTabla(tabla)  {
    return tabla.filter(t => !t.pagado);    
 }

 export function ccyFormat(num) {
   if (!num) {
      num = 0;
   }
   return `${num.toFixed(2)}`;
 }

 export function calculareTotale(ventas) {
   let totale = 0;
   ventas?.forEach( venta =>{
      totale = totale + (venta.precio * venta.cantidad);
   })
   return ccyFormat(totale);
 }

 export function calculareTotalByRoom(numeroHabitacion, ventas) {
    let ventasRoom = Object.values(ventas)?.filter(venta => {
       return venta.numeroHabitacion === numeroHabitacion &&
               !venta.pagado  && !venta.cancelado
    })
    return calculareTotale(ventasRoom);
 }

export function sortVentas(ventas) {
   let ventasSorteades =  ventas.sort((a, b)  =>{
      var aa = a.fecha.split('/').reverse().join();
      var bb = b.fecha.split('/').reverse().join();
      return aa < bb ? -1 : (aa > bb ? 1 : 0);
  });
   return ventasSorteades;
}

export function stansasConExtra(ventas) {
   let ventasActivas = [];
   Object.values(ventas)?.filter( venta => !venta.cancelado && !venta.pagado)
         .forEach( venta => {
            let ventaActiva = {camera: venta.numeroHabitacion, totale: venta.total} ;
            ventasActivas.push(ventaActiva);
         } );
   return ventasActivas;
} 

export function getNumerosStanzas(ventasActivas) {
   let numerosStanzas = [];
   Object.values(ventasActivas)?.forEach( venta =>  {

      if (!numerosStanzas[venta.camera]) {
         numerosStanzas[venta.camera] = (venta.totale - 0);
      } else {
         numerosStanzas[venta.camera] += ((venta.totale - 0));
      }
   } );
   return numerosStanzas;
} 

export function getStanzasActivasTotale(ventasActivas, numeroStanza) {
   let stanzasActivasConTotale = [];
   let precio = 0;
   Object.values(numeroStanza)?.forEach( stanza =>  {
      Object.values(ventasActivas)?.filter( venta => venta.numeroHabitacion === stanza)
         .forEach(venta => {
            precio = precio + venta.total;
         });
         let nuovaSanza = {camera: stanza, totale: precio};
         stanzasActivasConTotale.push(nuovaSanza);
         precio = 0; 
   } );
   return stanzasActivasConTotale;
} 



