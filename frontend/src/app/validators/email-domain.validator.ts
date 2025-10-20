import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailPatternValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    // 正規表現: 8桁の数字 + @ed.tmu.ac.jp
    const pattern = /^[0-9]{8}@ed\.tmu\.ac\.jp$/;

    if (email && !pattern.test(email)) {
      return { emailPattern: true }; // エラーキーを返す
    }
    return null; // 問題がなければnullを返す
  };
}
