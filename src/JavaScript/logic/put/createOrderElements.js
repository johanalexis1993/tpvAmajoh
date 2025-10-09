export const createOrderElements = (
  pedido,
  table,
  cliente,
  horaCreacion,
  tiempoTranscurrido,
  productos
) => {
  const elements = [
    { label: 'Pedido ID:', value: pedido._id },
    { label: 'Pedido:', value: table },
    { label: 'Cliente:', value: cliente },
    { label: 'Total:', value: pedido.total },
    { label: 'Productos:', value: productos },
    { label: 'Hora de creación:', value: horaCreacion },
    { label: 'Tiempo transcurrido:', value: `${tiempoTranscurrido} minutos` },
    { label: 'Estado:', value: pedido.status }
  ]
  return elements
}
