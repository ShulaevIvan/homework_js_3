class Goods {
    constructor(id, name, description, sizes, price, available) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.sizes = sizes;
        this.price = price;
        this.available = available;
    };

    setAvailable(value) {
        this.available = value;
    };
};

class BasketGood extends Goods {
    constructor(id, name, description, sizes, price, available, amount) {
        super(id, name, description, sizes, price, available);
        this.amount = amount;
    };
};

class GoodsList {
    #goods
    constructor(filter, sortPrice, sortDir) {
        this.#goods = [];
        this.filter = filter;
        this.sortPrice = sortPrice;
        this.sortDir = sortDir;
    };

    get list() {
        let filterArr = this.#goods.filter(value => this.filter.test(value.name));

        if (!this.sortPrice) {
            return filterArr;
        };

        if (this.sortDir) {
                return filterArr.sort((start, end) => (start.price - end.price));
        };
        return filterArr.sort((start, end) => (end.price - start.price));
    };

    add(good) {
        this.#goods.push(good);
    };

    remove(id) {
        let getIndex = this.#goods.findIndex(value => value.id === id);
        if (getIndex != undefined) {
            this.#goods.splice(getIndex, 1);
        };
        return getIndex;
    };
};

class Basket {
    constructor() {
        this.goods = [];
    };

    get totalAmount() {
        return this.goods.map(item => item.amount).reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    };

    get totalSum() {
        return this.goods.reduce((previousValue, currentValue) => previousValue + currentValue.amount * currentValue.price, 0);
    };

    add(good, amount) {
        let index = this.goods.findIndex(value => value.id === good.id);
        if (index >= 0) {
            this.goods[index].amount += amount;
        } else {
            let addGood = new BasketGood(good.id, good.name, good.description, good.sizes, good.price, good.available, amount);
            this.goods.push(addGood);
        };
    };

    remove(good, amount) {
        let index = this.goods.findIndex(value => value.id === good.id);
        if (index >= 0) {
            if (this.goods[index].amount - amount <= 0 || amount === 0) {
                this.goods.splice(index, 1);
            } else {
                this.goods[index].amount -= amount;
            };
        };
    };

    clear() {
        this.goods.length = 0;
    };

    removeUnavailable() {
        this.goods.filter(item => item.available === false).forEach(value => this.remove(value));
    };
};

const catalog = new GoodsList(/Dress/i, true, false);
const basket = new Basket();
catalog.sortPrice = true;
catalog.sortDir = false;


let firstGood = new Goods(1, 'TestGood 1', 'Test desc 1', [24, 25, 26], 90, true),
    secondGood = new Goods(2, 'TestGood 2', 'Test desc 2', ['xs', 'm', 'xl'], 1770, true),
    thirdGood = new Goods(3, 'TestGood 3', 'Test desc 3', ['s', 'm', 'xl'], 190, true),
    fourthGood = new Goods(4, 'TestGood 4', 'Test desc 4', [36, 37, 38], 150, true),
    fifthGood = new Goods(5, 'TestGood 5', 'Test desc 5', ['m', 'l', 'xl'], 1700, true);

let goodArr =[firstGood, secondGood, thirdGood, fourthGood, fifthGood];

// добавление в корзину и каталог

for (let i = 0; i < goodArr.length; i++) {
    counter = i+1
    catalog.add(goodArr[i]);
    basket.add(goodArr[i], counter);
};

secondGood.setAvailable(false);
thirdGood.setAvailable(false);

//мини регулярка

catalog.filter = /s/i;

// сортировка
console.log(catalog.list);

// удаление

catalog.remove(4);

console.log(`Количество товаров в корзине: ${basket.totalAmount}`);
console.log(`Стоимость корзины: ${basket.totalSum}`);

basket.remove(secondGood, 1);
basket.remove(thirdGood, 2);

basket.removeUnavailable();

basket.clear();