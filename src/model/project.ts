import { ProjectStatus } from "../util/project-status";

//Project Model
export class Project {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}
