import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type { EmailValidator } from '../../core/ports/email-validator';

@Injectable({ providedIn: 'root' })
export class EmailApiAdapter implements EmailValidator {
  constructor(private http: HttpClient) {}

  async validate(email: string): Promise<boolean> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ isValid: boolean }>('/api/validate-email', { email })
      );
      return Boolean(res?.isValid);
    } catch (err) {
      console.error('Email validation error', err);
      return false;
    }
  }
}

// Backward-compatible helper using fetch so non-Angular callers still work
export async function checkEmailValidity(email: string): Promise<boolean> {
  try {
    const resp = await fetch('/api/validate-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await resp.json();
    return Boolean(data?.isValid);
  } catch (err) {
    console.error('Email validation (fallback) error', err);
    return false;
  }
}
