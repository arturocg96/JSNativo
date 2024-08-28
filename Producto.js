class Producto {
    constructor(sku, title, price) {
        this.sku = sku;
        this.title = title;
        this.price = price;
    }

    get getSku() {
        return this.sku;
    }

    get getTitle() {
        return this.title;
    }

    get getPrice() {
        return this.price;
    }
}
