//ProjectStatus Enum
enum ProjectStatus {
  Active,
  Finished,
}

//Project Model
class Project {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

type Listener<T> = (items: T[]) => void;
//Common status class
class State<T>{
  //adding listerners(list of methods) which holds the function which needs to be triggered whenever something changes in app
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}


//Project State class
class ProjectState extends State<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;
  
    private constructor() {
      super();
    }
  
    static getInstance() {
      if (this.instance) {
        return this.instance;
      }
      this.instance = new ProjectState();
      return this.instance;
    }
  
    addProject(title: string, description: string, numOfPeople: number) {
      const newProject = new Project(
        Date.now(),
        title,
        description,
        numOfPeople,
        ProjectStatus.Active
      );
      this.projects.push(newProject);
      for (const listenerFn of this.listeners) {
        listenerFn(this.projects.slice());
      }
    }
  }

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
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

//Common component class for All UI classes
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostId)! as T;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }
    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    if (insertAtStart) {
      this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

  renderContent(){

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

//class to render the project lists on DOM... follow same approach as followed for input
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[] = [];
  //added type as new class variable which will tell if list is of inactive projects or active projects
  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];
    this.configure();
    this.renderContent();
  }

  renderProjects() {
    const listElement = document.getElementById(
      `${this.type}-projects`
    )! as HTMLUListElement;
    //this fixes the dupliction of project on screen
    listElement.innerHTML = "";
    for (const listEle of this.assignedProjects) {
      const listItem = document.createElement("li");
      listItem.textContent = listEle.title;
      listElement.append(listItem);
    }
    this.renderProjects();
  }

  configure(): void {
    prjState.addListener((projects: Project[]) => {
      const filteredProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });
      this.assignedProjects = filteredProjects;
      
    });
  }

  renderContent() {
    const listId = `${this.type}-project-lists`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + "PROJECTS";
  }
}

const prjInput = new ProjectInput();
const prjState = ProjectState.getInstance();
const prjActiveProjects = new ProjectList("active");
const prjInactiveProjects = new ProjectList("finished");
