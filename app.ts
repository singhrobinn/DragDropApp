
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