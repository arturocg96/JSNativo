document.addEventListener('DOMContentLoaded', () => {
    let listadoProductos = [];
    let moneda = '';
    const carrito = new Carrito(listadoProductos);

    const API_KEY ="1253624457670287360";

    const tablaCuerpo = document.querySelector('.carrito__tabla tbody');
    const resumenItems = document.querySelector('.carrito__resumen-items');
    const resumenTotalPrecio = document.querySelector('.carrito__resumen-total-precio');

    function cargarProductos(datos) {
        moneda = datos.currency; // Almacenar la moneda
        listadoProductos = datos.productos.map(item => new Producto(item.sku, item.title, item.price));
        carrito.productos = listadoProductos;
        syncTabla();
    }

    function obtenerProductos() {
        fetch(`https://jsonblob.com/api/jsonBlob/${API_KEY}`)
            .then(res => res.json())
            .then(datos => {
                cargarProductos(datos);
            })
            .catch(error => console.error('ERROR PETICIÓN', error));
    }

    function syncTabla() {
        tablaCuerpo.innerHTML = '';
        listadoProductos.forEach(producto => {
            const fila = document.createElement('tr');
            fila.classList.add('carrito__tabla-fila');

            const nombreProducto = document.createElement('td');
            nombreProducto.classList.add('carrito__tabla-celda');
            nombreProducto.innerHTML = `${producto.title}<br><span class="carrito__sku">SKU: ${producto.sku}</span>`;
            fila.append(nombreProducto);

            const cantidadProducto = document.createElement('td');
            cantidadProducto.classList.add('carrito__tabla-celda');
            const cantidadWrapper = document.createElement('div');
            cantidadWrapper.classList.add('carrito__cantidad-wrapper');

            const restarBtn = document.createElement('button');
            restarBtn.textContent = '-';
            restarBtn.classList.add('carrito__btn-restar');
            cantidadWrapper.append(restarBtn);

            const cantidadInput = document.createElement('input');
            cantidadInput.type = 'number';
            cantidadInput.value = 0;
            cantidadInput.min = 0;
            cantidadInput.classList.add('carrito__tabla-input');
            cantidadWrapper.append(cantidadInput);

            const sumarBtn = document.createElement('button');
            sumarBtn.textContent = '+';
            sumarBtn.classList.add('carrito__btn-sumar');
            cantidadWrapper.append(sumarBtn);

            cantidadProducto.append(cantidadWrapper);
            fila.append(cantidadProducto);

            const precioUnidadProducto = document.createElement('td');
            precioUnidadProducto.textContent = producto.price.toFixed(2) + ' ' + moneda;
            precioUnidadProducto.classList.add('carrito__tabla-celda');
            fila.append(precioUnidadProducto);

            const totalProducto = document.createElement('td');
            totalProducto.textContent = '0.00 ' + moneda;
            totalProducto.classList.add('carrito__tabla-celda');
            fila.append(totalProducto);

            tablaCuerpo.append(fila);

            restarBtn.addEventListener('click', () => {
                if (cantidadInput.value > 0) {
                    cantidadInput.value = parseInt(cantidadInput.value) - 1;
                    carrito.actualizarUnidades(producto.sku, parseInt(cantidadInput.value));
                    actualizarResumen();
                    actualizarTotalProducto();
                }
            });

            sumarBtn.addEventListener('click', () => {
                cantidadInput.value = parseInt(cantidadInput.value) + 1;
                carrito.actualizarUnidades(producto.sku, parseInt(cantidadInput.value));
                actualizarResumen();
                actualizarTotalProducto();
            });

            cantidadInput.addEventListener('change', () => {
                carrito.actualizarUnidades(producto.sku, parseInt(cantidadInput.value));
                actualizarResumen();
                actualizarTotalProducto();
            });

            function actualizarTotalProducto() {
                const cantidad = parseInt(cantidadInput.value);
                totalProducto.textContent = `${(producto.price * cantidad).toFixed(2)} ${moneda}`;
            }
        });
    }

    function actualizarResumen() {
        resumenItems.innerHTML = '';
        const carritoActual = carrito.obtenerCarrito();
        carritoActual.products.forEach(producto => {
            const itemResumen = document.createElement('div');
            itemResumen.classList.add('carrito__resumen-item');

            const nombreProducto = document.createElement('span');
            nombreProducto.textContent = producto.title;
            nombreProducto.classList.add('carrito__resumen-nombre');
            itemResumen.append(nombreProducto);

            const cantidadProducto = document.createElement('span');
            cantidadProducto.textContent = ` x ${producto.cantidad}`;
            cantidadProducto.classList.add('carrito__resumen-cantidad');
            itemResumen.append(cantidadProducto);

            const totalProducto = document.createElement('span');
            totalProducto.textContent = ` = ${(producto.price * producto.cantidad).toFixed(2)} ${moneda}`;
            totalProducto.classList.add('carrito__resumen-total');
            itemResumen.append(totalProducto);

            resumenItems.append(itemResumen);
        });

        resumenTotalPrecio.textContent = `${carritoActual.total.toFixed(2)} ${moneda}`;
    }

    obtenerProductos();
});

