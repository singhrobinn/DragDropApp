//MAX's Validation code

interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}
//method which will actually perform validation
function validate(validatable: Validatable): boolean {
  let isValid = true;

  if (validatable.required) {
    console.log(validatable.value.toString().trim().length);
    isValid = isValid && validatable.value.toString().trim().length != 0;
  }
  if (validatable.minLength != null && typeof validatable.value === "string") {
    isValid =
      isValid &&
      validatable.value.toString().trim().length > validatable.minLength;
  }
  if (validatable.maxLength != null && typeof validatable.value === "string") {
    isValid =
      isValid &&
      validatable.value.toString().trim().length <= validatable.maxLength;
  }
  if (validatable.min != null && typeof validatable.value === "number") {
    isValid = isValid && +validatable.value > validatable.min;
  }
  if (validatable.max != null && typeof validatable.value === "number") {
    isValid = isValid && +validatable.value <= validatable.max;
  }
  return isValid;
}

//===============Another Validation approach=================better one ======

const config: { [input: string]: string[] } = {};

//wtf is this?
const addValidator = (input: string, type: string) => {
  config[input] = config[input] ? [...config[input], type] : [type];
};

const Required = (_: any, input: string) => addValidator(input, "required");
const Maxlength = (_: any, input: string) => addValidator(input, "maxlength");
const Positive = (_: any, input: string) => addValidator(input, "positive");

const validateNew = (value: any) =>
  Object.entries(config).every(([input, types]) =>
    types.every(
      (type) =>
        (type === "required" && value[input]) ||
        (type === "positive" && value[input] > 0) ||
        (type === "maxlength" && value[input].length < 5)
    )
  );

  
//Autobind decorator
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  console.log(originalMethod);
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  console.log(adjDescriptor);
  return adjDescriptor;
}

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

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
    this.attach();
  }

  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const input = this.gatherInput();
    if (Array.isArray(input)) {
      const [title, desc, people] = input;
      console.log([title, desc, people]);
      this.clearForm();
    }
  }

  private clearForm() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }

  private gatherInput(): [string, string, number] | void {
    const title = this.titleInputElement.value;
    const description = this.descriptionInputElement.value;
    const people = this.peopleInputElement.value;
    const titleValidatable: Validatable = {
      value: title,
      required: true,
      minLength: 5,
      maxLength: 10,
    };

    const descriptionValidatable: Validatable = {
      value: description,
      required: true,
      minLength: 5,
      maxLength: 50,
    };

    const peopleValidatable: Validatable = {
      value: +people,
      required: true,
      min: 1,
      max: 10,
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

const prjInput = new ProjectInput();
