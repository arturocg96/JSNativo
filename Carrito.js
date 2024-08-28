class Carrito {
    constructor(productos) {
        this.productos = productos;
        this.carrito = {};
    }

    actualizarUnidades(sku, unidades) {
        if (this.carrito[sku]) {
            this.carrito[sku].cantidad = unidades;
        } else {
            const producto = this.productos.find(p => p.sku === sku);
            if (producto) {
                this.carrito[sku] = {
                    ...producto,
                    cantidad: unidades
                };
            }
        }
        if (this.carrito[sku] && this.carrito[sku].cantidad <= 0) {
            delete this.carrito[sku];
        }
    }

    obtenerInformacionProducto(sku) {
        return this.carrito[sku] || null;
    }

    obtenerCarrito() {
        const products = Object.values(this.carrito);
        const total = products.reduce((acc, p) => acc + (p.price * p.cantidad), 0);
        return {
            total: total,
            products: products
        };
    }
}
