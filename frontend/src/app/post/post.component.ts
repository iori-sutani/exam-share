
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-post',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './post.component.html',
	styleUrls: ['./post.component.scss']
})
export class PostComponent {
	form: FormGroup;
	years: number[] = [];
	previewSrc = signal<string | null>(null);
	submitting = signal(false);

	// メモ文字数カウント
	memoCount = () => this.form.get('memo')?.value?.length ?? 0;

	constructor(private fb: FormBuilder) {
			this.form = this.fb.group({
				photo: [null, Validators.required],
				year: [new Date().getFullYear(), Validators.required],
				subject: ['', [Validators.required, Validators.maxLength(100)]],
				term: ['spring', Validators.required], // spring=前期, fall=後期
				memo: ['', [Validators.maxLength(500)]]
			});

		// 年度リスト（直近15年）
		const current = new Date().getFullYear();
		for (let y = current; y >= current - 15; y--) this.years.push(y);
	}

	onFileSelected(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0] ?? null;

		if (!file) {
			this.form.patchValue({ photo: null });
			this.previewSrc.set(null);
			return;
		}

		// 画像以外は弾く
		if (!file.type.startsWith('image/')) {
			alert('画像ファイルを選択してください');
			input.value = '';
			return;
		}

		this.form.patchValue({ photo: file });
		this.form.get('photo')?.markAsDirty();

		// プレビュー表示
		const reader = new FileReader();
		reader.onload = () => this.previewSrc.set(reader.result as string);
		reader.readAsDataURL(file);
	}

	// 画像クリア
	clearPhoto(fileInput: HTMLInputElement) {
		fileInput.value = '';
		this.form.patchValue({ photo: null });
		this.previewSrc.set(null);
	}

	// 送信処理
	onSubmit() {
		if (this.form.invalid) return;
		this.submitting.set(true);
		// ダミー送信処理（API連携は後で）
		setTimeout(() => {
			alert('投稿が完了しました！');
			this.form.reset({
				photo: null,
				year: new Date().getFullYear(),
				term: 'spring',
				memo: ''
			});
			this.previewSrc.set(null);
			this.submitting.set(false);
		}, 1200);
	}
}
