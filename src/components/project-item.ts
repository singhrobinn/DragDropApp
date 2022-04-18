import { Autobind } from "../decorators/autobind";
import { Draggable } from "../model/drag-drop";
import { Project } from "../model/project";
import { Component } from "./base-component";

export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
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