import { Autobind } from "../decorators/autobind";
import { DragTarget } from "../model/drag-drop";
import { Project } from "../model/project";
import { prjState } from "../state/project-state";
import { ProjectStatus } from "../util/project-status";
import { Component } from "./base-component";
import { ProjectItem } from "./project-item";

//class to render the project lists on DOM... follow same approach as followed for input
export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget{
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
    dropHandler(event: DragEvent): void {
      const prjId = event.dataTransfer!.getData('text/plain');
      prjState.moveProject(prjId, this.type==='active'?ProjectStatus.Active:ProjectStatus.Finished);
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.remove('droppable');
    }
  
    @Autobind
    dragLeaveHandler(event: DragEvent): void {
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.remove('droppable');
    }
  
    @Autobind
    dragOverHandler(event: DragEvent): void {
      if(event.dataTransfer && event.dataTransfer.types[0]=='text/plain'){
        event.preventDefault();
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.add('droppable');
      }
      
    }
  
  }