interface Draggable{
  dragStartHandler(event: DragEvent):void;
  dragEndHandler(event: DragEvent):void;
}

interface DragTarget{
  dragOverHandler(event:DragEvent):void;
  dropHandler(event:DragEvent):void;
  dragLeaveHandler(event:DragEvent):void;
}

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
class State<T> {
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

//class to render the project lists on DOM... follow same approach as followed for input
class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget{
  assignedProjects: Project[] = [];
  //added type as new class variable which will tell if list is of inactive projects or active projects
  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];
    this.configure();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = "";
    for (const prjItem of this.assignedProjects) {
     new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
    }
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
      this.renderProjects();
      console.log(this.element);
    });
    this.element.addEventListener('drop', this.dropHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('dragover', this.dragOverHandler);
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  @Autobind
  dropHandler(_: DragEvent): void {
    
  }

  @Autobind
  dragLeaveHandler(event: DragEvent): void {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }

  @Autobind
  dragOverHandler(_: DragEvent): void {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.add('droppable');
  }

}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
  project: Project;

  getPersonText():string{
    if(this.project.people===1){
      return '1 Person';
    }
    else{
      return `${this.project.people.toString()} Persons`;
    }
  }

  constructor(hostId: string, project:Project) {
    super('single-project', hostId, false, project.id.toString());
    this.project = project;
    this.configure();
    this.renderContent();
  }

  configure(){
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.getPersonText() + ' Assigned';
    this.element.querySelector('p')!.textContent = this.project.description;
  }

  @Autobind
  dragStartHandler(event: DragEvent): void {
    event.dataTransfer!.setData('text/plain', this.project.id.toString());
    event.dataTransfer!.effectAllowed='move';
  }

  @Autobind
  dragEndHandler(_: DragEvent): void {
    console.log("end");
  }
}

const prjInput = new ProjectInput();
const prjState = ProjectState.getInstance();
const prjActiveProjects = new ProjectList("active");
const prjInactiveProjects = new ProjectList("finished");
