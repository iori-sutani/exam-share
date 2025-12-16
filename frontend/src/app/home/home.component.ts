import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { GetRecentPastExamsUseCase } from '../../usecases/get-recent-past-exams.usecase';
import { PastExam } from '../../core/models/past-exam';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  posts$: Observable<PastExam[]> = of([]); // Firestoreからの投稿データを格納
  selectedPost: PastExam | null = null; // 詳細表示用の選択された投稿データ

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private getRecentPastExamsUseCase: GetRecentPastExamsUseCase
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.posts$ = this.getRecentPastExamsUseCase.execute();

      this.posts$.subscribe((data) => {
        console.log('Firestoreから取得したデータ:', data);
      });
    }
  }

  // 詳細画面を表示
  showDetails(post: PastExam): void {
    this.selectedPost = post;
  }

  // 詳細画面を閉じる
  closeDetails(): void {
    this.selectedPost = null;
  }
}
