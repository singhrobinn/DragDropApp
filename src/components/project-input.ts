import { Autobind } from "../decorators/autobind";
import { Validatable } from "../model/validatable";
import { prjState } from "../state/project-state";
import { validate } from "../util/validation";
import { Component } from "./base-component";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;
  
    constructor() {
      super("project-input", "app", true, "user-input");
      this.titleInputElement = this.element.querySelector(
        "#title"
      ) as HTMLInputElement;
      this.descriptionInputElement = this.element.querySelector(
        "#description"
      ) as HTMLInputElement;
      this.peopleInputElement = this.element.querySelector(
        "#people"
      ) as HTMLInputElement;
  
      this.configure();
      this.renderContent();
    }
  
    @Autobind
    private submitHandler(event: Event) {
      event.preventDefault();
      const input = this.gatherInput();
      if (Array.isArray(input)) {
        const [title, desc, people] = input;
        prjState.addProject(title, desc, people);
        this.clearForm();
      }
    }
  
    private clearForm() {
      this.titleInputElement.value = "";
      this.descriptionInputElement.value = "";
      this.peopleInputElement.value = "";
    }
  
    configure() {
      this.element.addEventListener("submit", this.submitHandler);
    }
  
    renderContent() {}
  
    private gatherInput(): [string, string, number] | void {
      const title = this.titleInputElement.value;
      const description = this.descriptionInputElement.value;
      const people = this.peopleInputElement.value;
      const titleValidatable: Validatable = {
        value: title,
        required: true,
        minLength: 1,
        maxLength: 30,
      };
  
      const descriptionValidatable: Validatable = {
        value: description,
        required: true,
        minLength: 1,
        maxLength: 100,
      };
  
      const peopleValidatable: Validatable = {
        value: +people,
        required: true,
        min: 1,
        max: 90,
      };
  
      if (
        !validate(titleValidatable) ||
        !validate(descriptionValidatable) ||
        !validate(peopleValidatable)
      ) {
        alert("Invalid input!");
        return;
      } else {
        return [title, description, +people];
      }
    }
  }