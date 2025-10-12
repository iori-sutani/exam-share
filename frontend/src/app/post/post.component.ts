import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

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

	constructor(private fb: FormBuilder, private firestore: Firestore, private storage: Storage) {
			this.form = this.fb.group({
				photo: [null, Validators.required],
				year: [new Date().getFullYear(), Validators.required],
				subject: ['', [Validators.required, Validators.maxLength(100)]],
				term: ['spring', Validators.required],
				memo: ['', [Validators.maxLength(500)]]
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

  async uploadImageAndGetUrl(file: File): Promise<string> {
  const filePath = `posts/${Date.now()}_${file.name}`;
  const storageRef = ref(this.storage, filePath);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

	// 送信処理
	async onSubmit() {
		if (this.form.invalid) return;
		this.submitting.set(true);
		// ダミー送信処理（API連携は後で）

    let photoUrl = '';
    const file = this.form.value.photo;
    if (file) {
      photoUrl = await this.uploadImageAndGetUrl(file);
    }

    const data = {
      ...this.form.value,
      photo: photoUrl,
      createdAt: new Date()
    };
    await addDoc(collection(this.firestore, 'posts'), data);

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
