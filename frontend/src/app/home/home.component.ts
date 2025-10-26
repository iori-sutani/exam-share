import { Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private firestore = inject(Firestore);
  posts$: Observable<any[]> = new Observable(); // Firestoreからの投稿データを格納
  selectedPost: any = null; // 詳細表示用の選択された投稿データ

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const postsCollection = collection(this.firestore, 'posts');
      this.posts$ = collectionData(postsCollection);

      this.posts$.subscribe((data) => {
        console.log('Firestoreから取得したデータ:', data);
      });
    } else {
      // SSR/プリレンダー環境ではFirestore購読を行わない
      this.posts$ = new Observable();
    }
  }

  // 詳細画面を表示
  showDetails(post: any): void {
    this.selectedPost = post;
  }

  // 詳細画面を閉じる
  closeDetails(): void {
    this.selectedPost = null;
  }
}
