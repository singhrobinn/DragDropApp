
//GENERIC EXAMPLE 

function merge<T extends object, U extends object>(objA: T, objB:U){
    return Object.assign(objA, objB);
}

const merged = merge({name: 'Robin'}, {age:25});

console.log(merged.name);

interface lengthy{
    length : number;
}


function countAndPrint<T extends lengthy>(objA: T):[T, string, number]{
    let descriptionText: string;
    if(objA.length===0){
        descriptionText = '0 length text';
    }
    else if(objA.length===1){
        descriptionText = '1 length text';
    }
    else{
        descriptionText = 'long ass text';
    }
    return [objA, descriptionText, objA.length];
}


console.log(countAndPrint('BIIGGG'));








//GENERIC CLASSES

class DataStorage<T>{
    private data: T[] = [];

    addItem(item: T){
        this.data.push(item);
    }

    removeItem(item: T){
        if(this.data.indexOf(item)===-1){
            return;
        }
        this.data.splice(this.data.indexOf(item), 1);
    }

    getItems(){
        return [...this.data];
    }

}

const dataValue = new DataStorage<object>();
const objToBeDeleted = {name:'SOME NAMEE'};
dataValue.addItem({name:'SOME NAMEE'});
dataValue.addItem(objToBeDeleted);
dataValue.removeItem(objToBeDeleted);
console.log(dataValue.getItems());




//GENERIC UTILITY TYPES

interface CourseGoal{
    title: string;
    description: string;
    completionDate : Date;
}
 
function createCourseGoal(title: string, description: string, date: Date): CourseGoal{
    let goal: Partial<CourseGoal> = {};
    goal.completionDate=date;
    goal.description=description;
    goal.title=title;
    return goal as CourseGoal;
}


//DECORATORS
function Logger(logString: string){
    return (constructor:Function)=>{
        console.log(logString);
        console.log(constructor);
    }
}

@Logger('Something really cool')
@WithTemplate('<h1>Hello there</h1>', 'someText')
//@WithTemplate2('<h1>Hello there</h1>', 'someText')
class Person{
    name: string;
    age: number;

    constructor(name: string, age: number){
        this.name=name;
        this.age=age;
    }
}

let person = new Person('Robin', 25);
console.log(person);






function WithTemplate(template: string, hookId:string){
    return function(constructor:any){
        console.log('Inside withtemplate');
        const hookElement = document.getElementById(hookId);
        const p = new constructor();
        if(hookElement){
            hookElement.innerHTML=template;
            hookElement.querySelector('h1')!.innerText=p.name;
        }
    }
}


//GENERICS FOR PROPERTY
//GETS  2 argument when decorator applied on class property
function Log(target: any, propertyName: string){
    console.log('property logger');
    console.log(target, propertyName);
}


//decorator for class accessor accepts 3 arguments
function Log2(target: any, propertyName: string|Symbol, descriptor: PropertyDescriptor){
    console.log('property logger');
    console.log(target);
    console.log(propertyName);
    console.log(descriptor);
}

//decorator for class methods accepts 3 arguments
//this would also work for method argument decorator
//printSomethingPlease(@Log3 argument1: string)
function Log3(target: any, propertyName: string|Symbol, descriptor: PropertyDescriptor){
    console.log('method logger');
    console.log(target);
    console.log(propertyName);
    console.log(descriptor);
}

//Log methods are only called when class is defined not when object is instantiated
class Product{
    @Log
    name: string;
    private _price: number;
    constructor(name: string, _price:number){
        this.name=name;
        this._price=_price;
    }

    @Log2
    set price(val: number){
        this._price= val;
    }

    @Log3
    printSomethingPlease(){
        console.log('ok printing...');
    }
}

const product = new Product('Phone', 12000);





//To enable decorator to be executed when class object is created, below code
function WithTemplate2(template: string, hookId:string){
    return function<T extends {new(...args: any[]): []}>(originalConstructor:any){
        return new class constructor extends originalConstructor{
            constructor(...args:any[]){
                super();
                console.log('Inside withtemplate');
                const hookElement = document.getElementById(hookId);
                const p = new originalConstructor();
                if(hookElement){
                    hookElement.innerHTML=template;
                    hookElement.querySelector('h1')!.innerText=this.name;
                }
            }
            
        }
    }
}



//Binding example-- why we need

class BindPrinter{
    message: string = 'I am working';

    showMessage(){
        console.log(this.message);
    }
}

let p = new BindPrinter();


//button.addEventListener('click', p.showMessage.bind(p));   //without bind it will print undefined as object reference will be different for 'this' in showMessage



//Autobind decorator creation
//logic would be to create new PropertyDescriptor and then return it to the method to which decorator is applied

//_ name variables means we are telling TS that we are not using these variables
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor){
    const originalMethod = descriptor.value;  //value field holds the actual method
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get(){
            const boundFn = originalMethod.bind(this);
            console.log(boundFn);
            return boundFn;
        } 
    };
    return adjDescriptor;
}


class Printer{
    message: string = 'I am working';

    @Autobind
    showMessage(){
        console.log(this.message);
    }
}

let p1 = new Printer();
const button = document.querySelector('button')!;    //THIS IS NOT WORKING FOR SOME REASON GETTING NULL AS BUTTON
console.log(button);
button.addEventListener('click', p.showMessage);