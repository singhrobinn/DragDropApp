class ProjectInput{
    templateElement: HTMLTemplateElement;
    hostElement : HTMLDivElement;
    element : HTMLFormElement;
    titleInput : HTMLInputElement;
    descriptionInput : HTMLInputElement;
    peopleInput : HTMLInputElement;
    
    constructor(){
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        const importedNode = document.importNode(this.templateElement.content,true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id='user-input';
        this.attach();
        this.titleInput = this.templateElement.querySelector('#title') as HTMLInputElement;
        this.descriptionInput = this.templateElement.querySelector('#description') as HTMLInputElement
        this.peopleInput = this.templateElement.querySelector('#people') as HTMLInputElement;
        this.configure();
        console.log(this.titleInput);
    }

    private submitHandler(event: Event){
        event.preventDefault();
        console.log(this.templateElement);
    }

    private configure(){
        this.element.addEventListener('submit', this.submitHandler.bind(this));
    }


    private attach(){
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }

    
}

const prj = new ProjectInput();