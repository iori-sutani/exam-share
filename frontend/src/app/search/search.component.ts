import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  form: FormGroup; // 検索フォーム
  years: number[] = [2023, 2024, 2025]; // 年度の選択肢
  results$: Observable<any[]> | null = null; // 検索結果
  showResults = false; // 検索結果を表示するかどうか

  constructor(private fb: FormBuilder, private firestore: Firestore) {
    // フォームの初期化
    this.form = this.fb.group({
      year: [''],
      subject: [''],
      term: ['']
    });
  }

  // 検索処理
  onSearch(): void {
    const { year, subject, term } = this.form.value;

    // Firestoreクエリを作成
    const postsCollection = collection(this.firestore, 'posts');
    let q = query(postsCollection);

    if (year) {
      q = query(q, where('year', '==', +year));
    }
    if (subject) {
      q = query(q, where('subject', '==', subject));
    }
    if (term) {
      q = query(q, where('term', '==', term));
    }

    // クエリ結果を取得
    this.results$ = collectionData(q, { idField: 'id' });
    this.showResults = true; // 検索結果を表示
  }

  // 検索結果を閉じる
  onBack(): void {
    this.showResults = false;
    this.results$ = null;
  }
}
