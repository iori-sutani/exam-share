import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { GetAllSubjectsUseCase } from '../../usecases/get-all-subjects.usecase';
import { Subject } from '../../core/models/subject';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  subjects$: Observable<Subject[]> = of([]);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private getAllSubjectsUseCase: GetAllSubjectsUseCase
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.subjects$ = this.getAllSubjectsUseCase.execute();
    }
  }
}
