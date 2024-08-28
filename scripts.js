document.addEventListener('DOMContentLoaded', () => {
    let listadoProductos = [];
    let moneda = '';
    const carrito = new Carrito(listadoProductos);

    const API_KEY = "1253624457670287360";

    const elementos = {
        tablaCuerpo: document.querySelector('.carrito__tabla tbody'),
        resumenItems: document.querySelector('.carrito__resumen-items'),
        resumenTotalPrecio: document.querySelector('.carrito__resumen-total-precio')
    };

    inicializar();

    function inicializar() {
        obtenerProductos();
    }

    function obtenerProductos() {
        fetch(`https://jsonblob.com/api/jsonBlob/${API_KEY}`)
            .then(res => res.json())
            .then(datos => cargarProductos(datos))
            .catch(error => console.error('ERROR PETICIÓN', error));
    }

    function cargarProductos(datos) {
        moneda = datos.currency;
        listadoProductos = datos.productos.map(item => new Producto(item.sku, item.title, item.price));
        carrito.productos = listadoProductos;
        actualizarVistaProductos();
    }

    function actualizarVistaProductos() {
        elementos.tablaCuerpo.innerHTML = '';
        listadoProductos.forEach(producto => {
            const fila = crearFilaProducto(producto);
            elementos.tablaCuerpo.append(fila);
        });
    }

    function crearFilaProducto(producto) {
        const fila = document.createElement('tr');
        fila.classList.add('carrito__tabla-fila');

        const nombreProducto = crearCeldaNombre(producto);
        const cantidadProducto = crearCeldaCantidad(producto);
        const precioUnidadProducto = crearCeldaPrecio(producto.price);
        const totalProducto = crearCeldaTotal(producto);

        fila.append(nombreProducto, cantidadProducto, precioUnidadProducto, totalProducto);
        return fila;
    }

    function crearCeldaNombre(producto) {
        const celda = document.createElement('td');
        celda.classList.add('carrito__tabla-celda');
        celda.innerHTML = `${producto.title}<br><span class="carrito__sku">SKU: ${producto.sku}</span>`;
        return celda;
    }

    function crearCeldaCantidad(producto) {
        const celda = document.createElement('td');
        celda.classList.add('carrito__tabla-celda');

        const cantidadWrapper = document.createElement('div');
        cantidadWrapper.classList.add('carrito__cantidad-wrapper');

        const restarBtn = crearBoton('-', 'carrito__btn-restar', () => modificarCantidadProducto(producto, -1));
        const cantidadInput = crearCantidadInput(producto);
        const sumarBtn = crearBoton('+', 'carrito__btn-sumar', () => modificarCantidadProducto(producto, 1));

        cantidadWrapper.append(restarBtn, cantidadInput, sumarBtn);
        celda.append(cantidadWrapper);

        return celda;
    }

    function crearCeldaPrecio(precio) {
        const celda = document.createElement('td');
        celda.textContent = `${precio.toFixed(2)} ${moneda}`;
        celda.classList.add('carrito__tabla-celda');
        return celda;
    }

    function crearCeldaTotal(producto) {
        const celda = document.createElement('td');
        celda.textContent = `0.00 ${moneda}`;
        celda.classList.add('carrito__tabla-celda');
        celda.dataset.sku = producto.sku;
        return celda;
    }

    function crearBoton(texto, clase, eventoClick) {
        const boton = document.createElement('button');
        boton.textContent = texto;
        boton.classList.add(clase);
        boton.addEventListener('click', eventoClick);
        return boton;
    }

    function crearCantidadInput(producto) {
        const input = document.createElement('input');
        input.type = 'number';
        input.value = 0;
        input.min = 0;
        input.classList.add('carrito__tabla-input');
        input.dataset.sku = producto.sku;
        input.addEventListener('change', () => actualizarCantidadProducto(producto, input.value));
        return input;
    }

    function modificarCantidadProducto(producto, cambio) {
        const input = document.querySelector(`input[data-sku="${producto.sku}"]`);
        const nuevaCantidad = Math.max(0, parseInt(input.value) + cambio);
        input.value = nuevaCantidad;
        actualizarCantidadProducto(producto, nuevaCantidad);
    }

    function actualizarCantidadProducto(producto, cantidad) {
        carrito.actualizarUnidades(producto.sku, parseInt(cantidad));
        actualizarTotalProducto(producto.sku, cantidad);
        actualizarResumen();
    }

    function actualizarTotalProducto(sku, cantidad) {
        const producto = carrito.productos.find(prod => prod.sku === sku);
        const totalProducto = document.querySelector(`td[data-sku="${sku}"]`);
        totalProducto.textContent = `${(producto.price * cantidad).toFixed(2)} ${moneda}`;
    }

    function actualizarResumen() {
        elementos.resumenItems.innerHTML = '';
        const carritoActual = carrito.obtenerCarrito();
        carritoActual.products.forEach(producto => {
            const itemResumen = document.createElement('div');
            itemResumen.classList.add('carrito__resumen-item');

            itemResumen.innerHTML = `
                <span class="carrito__resumen-nombre">${producto.title}</span>
                <span class="carrito__resumen-cantidad"> x ${producto.cantidad}</span>
                <span class="carrito__resumen-total"> = ${(producto.price * producto.cantidad).toFixed(2)} ${moneda}</span>
            `;

            elementos.resumenItems.append(itemResumen);
        });

        elementos.resumenTotalPrecio.textContent = `${carritoActual.total.toFixed(2)} ${moneda}`;
    }
});

