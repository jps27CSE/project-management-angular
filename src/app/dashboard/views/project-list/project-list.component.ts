import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { DateFormatPipe } from '../dashboard/date-format.pipe';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [NgIf, DateFormatPipe],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css',
})
export class ProjectListComponent {
  @Input() project: any;
}
