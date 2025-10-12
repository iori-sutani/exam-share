import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  constructor() {}

  ngOnInit() {
    const postsCollection = collection(this.firestore, 'posts');
    this.posts$ = collectionData(postsCollection);

    this.posts$.subscribe((data) => {
      console.log('Firestoreから取得したデータ:', data);
    });
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
