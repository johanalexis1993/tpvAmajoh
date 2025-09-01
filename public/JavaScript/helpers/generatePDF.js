//write esta deprecated crear PDF en el backend para maxima seguridad
export const generateReceipt = (pedido, paymentMethod) => {
  const igiRate = 0.07
  const totalWithIgi = pedido.total
  const igiAmount = totalWithIgi * igiRate
  const total = totalWithIgi - igiAmount
  const cliente = pedido.user[0] || pedido.user
  const mostrarDatosCliente = cliente.rol && cliente.rol !== 'Admin'
  const selloURL =
    'https://res.cloudinary.com/dx0fsy5fw/image/upload/f_auto,q_auto:eco/v1723802226/sello_bfeijb.png'
  const printWindow = window.open('', '_blank')
  if (!printWindow) return alert('No se pudo abrir la ventana de impresión')
  const receiptHTML = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Recibo</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px 30px;
            max-width: 600px;
            margin: auto;
            background: white;
          }
          h1, h2 { text-align: center; }
          p { margin: 4px 0; }
          footer {
            text-align: center;
            margin-top: 30px;
          }
          img.sello {
            width: 240px;
            position: absolute;
            bottom: 600px;
            right: 50px;
            opacity: 0.4;
            transform: rotate(-15deg);
          }
        </style>
      </head>
      <body>
        <h1>AMAJOH</h1>
        <p>CIF: J09702291</p>
        <p>Teléfono: 928981113</p>
        <p>Dirección: Calle El Cosco, Número 2</p>
        <hr />
        <h2>Recibo</h2>
        <p><strong>Pedido ID:</strong> ${pedido._id}</p>
        <p><strong>Cliente:</strong> ${cliente.name}</p>
        ${
          mostrarDatosCliente
            ? `<p><strong>CIF:</strong> ${cliente.cifOrAutonomo}</p>
               <p><strong>Teléfono:</strong> ${cliente.telephon}</p>
               <p><strong>Dirección:</strong> ${cliente.address}</p>`
            : ''
        }
        <p><strong>Fecha:</strong> ${new Date(
          pedido.createdAt
        ).toLocaleString()}</p>
        <p><strong>Productos:</strong> ${pedido.products
          .map((p) => p.title)
          .join(', ')}</p>
        <p><strong>Importe Bruto:</strong> ${total.toFixed(2)} €</p>
        <p><strong>IGI (7%):</strong> ${igiAmount.toFixed(2)} €</p>
        <p><strong>Total a Pagar:</strong> ${totalWithIgi.toFixed(2)} €</p>
        <p><strong>Método de pago:</strong> ${paymentMethod}</p>
        <img src="${selloURL}" class="sello" alt="Sello" />
        <footer>
          <p>Gracias por su compra</p>
          <p>¡Vuelva pronto!</p>
        </footer>
        <script>
          window.onload = function () {
            window.print();
            setTimeout(() => window.close(), 1000);
          };
        </script>
      </body>
    </html>
  `
  printWindow.document.open()
  printWindow.document.write(receiptHTML) //write esta deprecated pasarlo al backend para que se cree alli para max seguridad
  printWindow.document.close()
}
