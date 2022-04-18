import { Project } from "../model/project";
import { ProjectStatus } from "../util/project-status";

export type Listener<T> = (items: T[]) => void;
//Common status class
export class State<T> {
  //adding listerners(list of methods) which holds the function which needs to be triggered whenever something changes in app
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

//Project State class
export class ProjectState extends State<Project> {
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
    this.updateListeners();
  }

  moveProject(prjId:string, newStatus: ProjectStatus){
    const project = this.projects.find(prj => prj.id.toString()===prjId);
    if(project && project.status!=newStatus){
      project.status=newStatus;
      this.updateListeners();
    }
  }

  updateListeners(){
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}
export const prjState = ProjectState.getInstance();