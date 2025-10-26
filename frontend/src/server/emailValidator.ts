import axios from 'axios';

type ZeroBounceStatus =
  | 'valid'
  | 'invalid'
  | 'catch-all'
  | 'unknown'
  | 'spamtrap'
  | 'abuse'
  | 'do_not_mail';

interface ZeroBounceResponse {
  address?: string;
  status?: ZeroBounceStatus;
  sub_status?: string;
  credits?: string;
  error?: string;
  [key: string]: unknown;
}

export async function getEmailStatus(
  email: string
): Promise<ZeroBounceStatus | 'error'> {
  const apiKey = process.env['ZEROBOUNCE_API_KEY'];
  if (!apiKey) {
    throw new Error('ZEROBOUNCE_API_KEY is not set');
  }

  try {
    const response = await axios.get<ZeroBounceResponse>(
      'https://api.zerobounce.net/v2/validate',
      {
        params: {
          api_key: apiKey,
          email,
        },
        // Explicitly set a short timeout so SSR doesn’t hang
        timeout: 8000,
      }
    );

    const { status } = response.data;
    return (status as ZeroBounceStatus) ?? 'error';
  } catch (error) {
    // Keep logs server-side only
    console.error('ZeroBounce validate error:', error);
    return 'error';
  }
}

export async function validateEmail(email: string): Promise<boolean> {
  const status = await getEmailStatus(email);
  return status === 'valid';
}
