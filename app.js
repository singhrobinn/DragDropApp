"use strict";
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById('project-input');
        this.hostElement = document.getElementById('app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = 'user-input';
        this.attach();
        this.titleInput = this.templateElement.querySelector('#title');
        this.descriptionInput = this.templateElement.querySelector('#description');
        this.peopleInput = this.templateElement.querySelector('#people');
        this.configure();
        console.log(this.titleInput);
    }
    submitHandler(event) {
        event.preventDefault();
        console.log(this.templateElement);
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this));
    }
    attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}
const prj = new ProjectInput();
