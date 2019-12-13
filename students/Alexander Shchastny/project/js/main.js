let userCart = [],
    catalogJSON = 'https://raw.githubusercontent.com/shchastny/js-2-08_21.11/master/students/Alexander%20Shchastny/project/json/catalog.json';

function makeRequest (method, url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText,
                    url: url
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusTextt,
                url: url
            });
        };
        xhr.send();
    });
}

makeRequest ('GET', catalogJSON)
    .then((data) =>{
       return JSON.parse(data);
    })
    .then((list) => {
        new Catalog(list);
    })
    .catch((err) => {
        let products = document.querySelector(".products");
        products.style.cssText = "grid-template-columns: none;";
        products.innerHTML = `<div>Не удалось загрузить <a href= "${err.url}" target="_blank">данные</a> с сервера, получена ошибка: ${err.status} (${err.statusText})</div>`;
    });

class Catalog {
    constructor(list){
        this.products = [];
        this.container = '.products';
        this.list = list;
        this._init();
    }
    _init(){
        this.list.forEach (el => {
            this.products.push(new Product (el));
        });
        this.render()
    }
    render(){
        let trg = document.querySelector (this.container);
        let str = '';
        this.products.forEach (prod => {
            str += prod.render();
        });
        trg.innerHTML = str;
    }
}

class Product {
    constructor(prod){
        this.id = prod.id;
        this.title = prod.title;
        this.price = prod.price;
        this.img = prod.img;
    }
    render() {
        return `<div class="product-item" data-id="${this.id}">
                    <img src="${this.img}" alt="Some img">
                    <div class="desc">
                        <h3>${this.title}</h3>
                        <p>${this.price} $</p>
                        <button class="buy-btn" 
                        data-id="${this.id}"
                        data-name="${this.title}"
                        data-image="${this.img}"
                        data-price="${this.price}">Купить</button>
                    </div>
                </div>`;
    }
}

class Cart {
    constructor(){
        this.basket = document.querySelector(`.btn-cart`);
    }

    renderCart() {
        let allProducts = '';
        let quantitySum = 0;
        for (let el of userCart) {
            allProducts += `<div class="cart-item" data-id="${el.id}">
                            <div class="product-bio">
                                <img src="${el.img}" alt="Some image">
                                <div class="product-desc">
                                    <p class="product-title">${el.name}</p>
                                    <p class="product-quantity">Quantity: ${el.quantity}</p>
                                    <p class="product-single-price">$${el.price} each</p>
                                </div>
                            </div>
                            <div class="right-block">
                                <p class="product-price">${el.quantity * el.price}</p>
                                <button class="del-btn" data-id="${el.id}">&times;</button>
                            </div>
                        </div>`;
            quantitySum += el.quantity;
        }

        quantitySum === 0 ? this.basket.innerText = `Корзина` : this.basket.innerText = `Корзина (${quantitySum})`;
        document.querySelector(`.cart-block`).innerHTML = allProducts;
    }
}

class CartItem {
    constructor() {
        this.cart = new Cart();
    }

    addProduct(product){
        let productId = +product.dataset['id']; //data-id="1"
        let find = userCart.find (element => element.id === productId); //товар или false
        if (!find) {
            userCart.push({
                name: product.dataset ['name'],
                id: productId,
                img: 'https://placehold.it/100x80',
                price: +product.dataset['price'],
                quantity: 1
            })
        } else {
            find.quantity++;
        }
        this.cart.renderCart();
    }

    removeProduct(product){
        let productId = +product.dataset['id'];
        let find = userCart.find (element => element.id === productId);
        if (find.quantity > 1) {
            find.quantity--;
        } else {
            userCart.splice(userCart.indexOf(find), 1);
            document.querySelector(`.cart-item[data-id="${productId}"]`).remove();
        }
        this.cart.renderCart();
    }
}


let item = new CartItem();

//console.log(catalog);
//кнопка скрытия и показа корзины
document.querySelector('.btn-cart').addEventListener('click', () => {
    document.querySelector('.cart-block').classList.toggle('invisible');
});
//кнопки удаления товара (добавляется один раз)
document.querySelector('.cart-block').addEventListener ('click', (evt) => {
    if (evt.target.classList.contains ('del-btn')) {
        item.removeProduct (evt.target);
    }
});
//кнопки покупки товара (добавляется один раз)
document.querySelector('.products').addEventListener ('click', (evt) => {
    if (evt.target.classList.contains ('buy-btn')) {
        item.addProduct (evt.target);
    }
});

//создание массива объектов - имитация загрузки данных с сервера
function fetchData(){
    let arr = [];
    for (let i = 0; i < items.length; i++) {
        arr.push (createProduct (i));
    }
    return arr;
}

//создание товара
function createProduct (i) {
    return {
        id: ids[i],
        title: items[i],
        price: prices[i],
        img: image,
    }
}