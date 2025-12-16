import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GetPostsBySubjectUseCase } from '../../usecases/get-posts-by-subject.usecase';
import { PastExam } from '../../core/models/past-exam';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-subject-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subject-detail.component.html',
  styleUrls: ['./subject-detail.component.scss']
})
export class SubjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private getPostsBySubjectUseCase = inject(GetPostsBySubjectUseCase);

  posts$: Observable<PastExam[]> | undefined;
  subjectId: string | null = null;

  ngOnInit(): void {
    this.subjectId = this.route.snapshot.paramMap.get('id');
    if (this.subjectId) {
      this.posts$ = this.getPostsBySubjectUseCase.execute(this.subjectId);
    }
  }
}
