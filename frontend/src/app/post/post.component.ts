import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-post',
  imports: [CommonModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    if (!this.selectedFile) return;
    // ここでAPI送信処理を実装（現状はダミー）
    alert('画像が投稿されました！');
    // 送信後リセット
    this.selectedFile = null;
    this.previewUrl = null;
  }
}
