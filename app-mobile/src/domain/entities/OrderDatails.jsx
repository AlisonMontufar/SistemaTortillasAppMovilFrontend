export default class OrderDetails {
  constructor(id, idPedido, empresa, nombreEncargado, sucursal, estatusGeneral, estatusDetalle, fechaHora,
    cantidad, total, producto, calle, numero, colonia, codigoPostal, ciudad, estado, latitud, longitud
  ) {
    this.id = id, 
    this.idPedido = idPedido, 
    this.empresa = empresa, 
    this.nombreEncargado = nombreEncargado, 
    this.sucursal = sucursal, 
    this.estatusGeneral = estatusGeneral, 
    this.estatusDetalle = estatusDetalle, 
    this.fechaHora = fechaHora,
    this.cantidad = cantidad, 
    this.total = total, 
    this.producto = producto, 
    this.calle = calle, 
    this.numero = numero, 
    this.colonia = colonia, 
    this.codigoPostal = codigoPostal, 
    this.ciudad = ciudad,
    this.estado = estado,
    this.latitud = latitud,
    this.longitud = longitud
  }
}
