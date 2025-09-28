import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  form: FormGroup;
  years: number[] = [];

  constructor(private fb: FormBuilder) {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 8 }, (_, i) => currentYear - i);
    this.form = this.fb.group({
      year: [''],
      subject: [''],
      term: [''],
    });
  }

  onSearch() {
    if (this.form.valid) {
      // 検索条件を一時的に表示
      console.log('検索条件:', this.form.value);
      // TODO: API連携や結果表示処理
    }
  }
}
