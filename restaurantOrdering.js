class DishNotFoundError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "Dish Not Found Error";
    }
}
class InvalidOrderError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "Invalid Order Error";
    }
}

class ValidationError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "Validation Error";
    }
}


class Menu {
    constructor() {
        if (new.target === Menu) {
            throw new TypeError("Menu is abstract");
        }
    }
    #dishes = {};

    addDish(dish) {
        if (!(dish instanceof Dish)) {
            throw new ValidationError("Only Dish instances allowed");
        }
        this.#dishes[dish.name] = dish;
    }

    removeDish(dishName) {
        delete this.#dishes[dishName];
    }

    viewMenu() {
        const menu = { ...this.#dishes };
        return menu;
    }
    increasePrice(dishName, percent) {
        const dish = this.#dishes[dishName];

        if (!dish) {
            throw new DishNotFoundError("Dish not found in menu");
        }

        if (typeof percent !== "number" || percent <= 0) {
            throw new ValidationError("Percent must be positive");
        }

        dish.price = Math.round(dish.price * (1 + percent / 100));
    }

    decreasePrice(dishName, percent) {
        const dish = this.#dishes[dishName];

        if (!dish) {
            throw new DishNotFoundError("Dish not found in menu");
        }

        if (typeof percent !== "number" || percent <= 0) {
            throw new ValidationError("Percent must be positive");
        }

        const newPrice = dish.price * (1 - percent / 100);

        if (newPrice <= 0) {
            throw new ValidationError("Price cannot be zero or negative");
        }

        dish.price = Math.round(newPrice);
    }
    applyDemandPricing(popularDishNames) {
        if (!Array.isArray(popularDishNames)) {
            throw new ValidationError("Must be an array of dish names");
        }

        for (const name of popularDishNames) {
            if (this.#dishes[name]) {
                this.#dishes[name].price = Math.round(
                    this.#dishes[name].price * 1.2
                );
            }
        }
    }


}


class AppetizersMenu extends Menu {
    constructor() {
        super();
        this.maxPrice = 10000;
        this.prepTime = "30min";
    }
}
class EntreesMenu extends Menu {
    constructor() {
        super();
        this.maxPrice = 20000;
        this.prepTime = "40min";
    }
}
class DessertsMenu extends Menu {
    constructor() {
        super();
        this.maxPrice = 30000;
        this.prepTime = "50min";
    }
}


class Customer {
    constructor(name, contactInfo,) {
        Object.defineProperty(this, "name", customerNameDescriptor);
        Object.defineProperty(this, "contactInfo", customerContactDescriptor);

        this.name = name;
        this.contactInfo = contactInfo;
        this.orderHistory = [];
    }

    placeOrder(order) {
        if (!(order instanceof Order)) {
            throw new InvalidOrderError("Invalid ordering, please give the correct order's data.")
        }
        this.orderHistory.push(order);
    }
    viewOrderHistory() {
        return [...this.orderHistory];
    }
}

class Order {
    #totalPrice = 0;

    constructor(customer) {
        if (!(customer instanceof Customer)) {
            throw new InvalidOrderError("Order must belong to a customer");
        }
        this.customer = customer;
        this.dishes = [];
    }

    addDishes(dishName, menus) {
        for (const menu of menus) {
            const menuItems = menu.viewMenu();
            if (menuItems[dishName]) {
                this.dishes.push(dishName);
                this.#totalPrice += menuItems[dishName].price;
                return;
            }
        }
        throw new DishNotFoundError("Dish not found in any menu")
    }

    getTotal() {
        return this.#totalPrice;
    }

    viewSummery() {
        this.getTotal();
        return [...this.dishes]
    }
}

class Dish {
    constructor(name, price) {

        Object.defineProperty(this, "price", priceDescriptor);

        this.name = name;
        this.price = price;
    }
}

class Appetizer extends Dish {
    constructor(name, price, type) {
        super(name, price);
        this.type = type;
    }
}


class Entree extends Dish {
    constructor(name, price, type) {
        super(name, price);
        this.type = type;
    }
}


class Dessert extends Dish {
    constructor(name, price, type) {
        super(name, price);
        this.type = type;

    }
}

const customerNameDescriptor = {
    get() {
        return this._name;
    },

    set(name) {
        if (typeof name !== "string" || name.length === 0) {
            throw new ValidationError("Name must be a string and at least 1 character long");
        };
        this._name = name;
    }
}


const customerContactDescriptor = {
    get() {
        return this._contact;
    },

    set(contact) {
        if (typeof contact !== "string" || contact.length < 9) {
            throw new ValidationError("Contact must be a Number and exactly 9 characters long Armenian contact number");
        };
        this._contact = contact;
    }
}

const priceDescriptor = {
    get() {
        return this._price;
    },

    set(price) {
        if (price < 0) {
            throw new ValidationError("Price must be a positive");
        }
        this._price = price;
    }
}



//Menu and Dishes 

const desserts = new DessertsMenu();
const entrees = new EntreesMenu();

desserts.addDish(new Dessert("Cake", 3000, "sweet"));
desserts.addDish(new Dessert("IceCream", 2000, "cold"));

entrees.addDish(new Entree("Steak", 8000, "Well done"));

console.log(desserts.viewMenu());
console.log(entrees.viewMenu());


//Dynamic pricing test

desserts.increasePrice("Cake", 10);
console.log(desserts.viewMenu().Cake.price); 

desserts.decreasePrice("IceCream", 5);
console.log(desserts.viewMenu().IceCream.price); 

desserts.applyDemandPricing(["Cake"]);
console.log(desserts.viewMenu().Cake.price); 



//Customer and order test

const customer = new Customer("Grish", "099123456");
const order = new Order(customer);

customer.placeOrder(order);

console.log(customer.viewOrderHistory());


//Order and Add dishes test


order.addDishes("Cake", [desserts, entrees]);
order.addDishes("Steak", [desserts, entrees]);

console.log(order.viewSummery());
// ['Cake', 'Steak']

console.log(order.getTotal());



//Placorder test

customer.placeOrder(order);

console.log(customer.viewOrderHistory());


