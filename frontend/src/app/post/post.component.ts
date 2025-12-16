import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { emailPatternValidator } from '../validators/email-domain.validator';
import { CreatePastExamUseCase } from '../../usecases/create-past-exam.usecase';
import { NewPastExam } from '../../core/models/past-exam';

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
	errorMessage = signal<string | null>(null);

	// メモ文字数カウント
	memoCount = () => this.form.get('memo')?.value?.length ?? 0;

	constructor(
    private fb: FormBuilder,
    private createPastExamUseCase: CreatePastExamUseCase
  ) {
			this.form = this.fb.group({
				photo: [null, Validators.required],
				year: [new Date().getFullYear(), Validators.required],
				subject: ['', [Validators.required, Validators.maxLength(100)]],
				term: ['spring', Validators.required],
				memo: ['', [Validators.maxLength(500)]],
				email: [
					'',
					[
						Validators.required,
						Validators.email,
						emailPatternValidator()
					]
				]
			});

		// 年度リスト（直近8年）
		const current = new Date().getFullYear();
		for (let y = current; y >= current - 8; y--) this.years.push(y);
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
	async onSubmit() {
		if (this.form.invalid) return;
		this.submitting.set(true);
		this.errorMessage.set(null);

		try {
			const file = this.form.value.photo;

      const fv = this.form.value;
      const input: NewPastExam = {
        subject: fv.subject,
        term: fv.term,
        year: Number(fv.year),
        memo: fv.memo ?? '',
        photo: '', // UseCase will handle upload and set URL
        email: fv.email,
      };

      await this.createPastExamUseCase.execute(input, file);

			setTimeout(() => {
				alert('投稿が完了しました！');
				this.form.reset({
					photo: null,
					year: new Date().getFullYear(),
					term: 'spring',
					memo: '',
					email: ''
				});
				this.previewSrc.set(null);
				this.submitting.set(false);
			}, 1200);
		} catch (error: any) {
			console.error('投稿中にエラーが発生しました:', error);
      if (error.message === 'email_invalid') {
        this.errorMessage.set('無効なメールアドレスです。');
      } else {
        this.errorMessage.set('投稿中にエラーが発生しました。');
      }
			this.submitting.set(false);
		}
	}
}
