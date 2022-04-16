"use strict";
//GENERIC EXAMPLE 
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function merge(objA, objB) {
    return Object.assign(objA, objB);
}
const merged = merge({ name: 'Robin' }, { age: 25 });
console.log(merged.name);
function countAndPrint(objA) {
    let descriptionText;
    if (objA.length === 0) {
        descriptionText = '0 length text';
    }
    else if (objA.length === 1) {
        descriptionText = '1 length text';
    }
    else {
        descriptionText = 'long ass text';
    }
    return [objA, descriptionText, objA.length];
}
console.log(countAndPrint('BIIGGG'));
//GENERIC CLASSES
class DataStorage {
    constructor() {
        this.data = [];
    }
    addItem(item) {
        this.data.push(item);
    }
    removeItem(item) {
        if (this.data.indexOf(item) === -1) {
            return;
        }
        this.data.splice(this.data.indexOf(item), 1);
    }
    getItems() {
        return [...this.data];
    }
}
const dataValue = new DataStorage();
const objToBeDeleted = { name: 'SOME NAMEE' };
dataValue.addItem({ name: 'SOME NAMEE' });
dataValue.addItem(objToBeDeleted);
dataValue.removeItem(objToBeDeleted);
console.log(dataValue.getItems());
function createCourseGoal(title, description, date) {
    let goal = {};
    goal.completionDate = date;
    goal.description = description;
    goal.title = title;
    return goal;
}
//DECORATORS
function Logger(logString) {
    return (constructor) => {
        console.log(logString);
        console.log(constructor);
    };
}
let Person = 
//@WithTemplate2('<h1>Hello there</h1>', 'someText')
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
};
Person = __decorate([
    Logger('Something really cool'),
    WithTemplate('<h1>Hello there</h1>', 'someText')
    //@WithTemplate2('<h1>Hello there</h1>', 'someText')
], Person);
let person = new Person('Robin', 25);
console.log(person);
function WithTemplate(template, hookId) {
    return function (constructor) {
        console.log('Inside withtemplate');
        const hookElement = document.getElementById(hookId);
        const p = new constructor();
        if (hookElement) {
            hookElement.innerHTML = template;
            hookElement.querySelector('h1').innerText = p.name;
        }
    };
}
//GENERICS FOR PROPERTY
//GETS  2 argument when decorator applied on class property
function Log(target, propertyName) {
    console.log('property logger');
    console.log(target, propertyName);
}
//decorator for class accessor accepts 3 arguments
function Log2(target, propertyName, descriptor) {
    console.log('property logger');
    console.log(target);
    console.log(propertyName);
    console.log(descriptor);
}
//decorator for class methods accepts 3 arguments
//this would also work for method argument decorator
//printSomethingPlease(@Log3 argument1: string)
function Log3(target, propertyName, descriptor) {
    console.log('method logger');
    console.log(target);
    console.log(propertyName);
    console.log(descriptor);
}
//Log methods are only called when class is defined not when object is instantiated
class Product {
    constructor(name, _price) {
        this.name = name;
        this._price = _price;
    }
    set price(val) {
        this._price = val;
    }
    printSomethingPlease() {
        console.log('ok printing...');
    }
}
__decorate([
    Log
], Product.prototype, "name", void 0);
__decorate([
    Log2
], Product.prototype, "price", null);
__decorate([
    Log3
], Product.prototype, "printSomethingPlease", null);
const product = new Product('Phone', 12000);
//To enable decorator to be executed when class object is created, below code
function WithTemplate2(template, hookId) {
    return function (originalConstructor) {
        return new class constructor extends originalConstructor {
            constructor(...args) {
                super();
                console.log('Inside withtemplate');
                const hookElement = document.getElementById(hookId);
                const p = new originalConstructor();
                if (hookElement) {
                    hookElement.innerHTML = template;
                    hookElement.querySelector('h1').innerText = this.name;
                }
            }
        };
    };
}
//Binding example-- why we need
class BindPrinter {
    constructor() {
        this.message = 'I am working';
    }
    showMessage() {
        console.log(this.message);
    }
}
let p = new BindPrinter();
//button.addEventListener('click', p.showMessage.bind(p));   //without bind it will print undefined as object reference will be different for 'this' in showMessage
//Autobind decorator creation
//logic would be to create new PropertyDescriptor and then return it to the method to which decorator is applied
//_ name variables means we are telling TS that we are not using these variables
function Autobind(_, _2, descriptor) {
    const originalMethod = descriptor.value; //value field holds the actual method
    const adjDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            const boundFn = originalMethod.bind(this);
            console.log(boundFn);
            return boundFn;
        }
    };
    return adjDescriptor;
}
class Printer {
    constructor() {
        this.message = 'I am working';
    }
    showMessage() {
        console.log(this.message);
    }
}
__decorate([
    Autobind
], Printer.prototype, "showMessage", null);
let p1 = new Printer();
const button = document.querySelector('button'); //THIS IS NOT WORKING FOR SOME REASON GETTING NULL AS BUTTON
console.log(button);
button.addEventListener('click', p.showMessage);
