import axios from 'axios';

export async function validateEmail(email: string): Promise<boolean> {
  try {
    const response = await axios.get('https://api.zerobounce.net/v2/validate', {
      params: {
        api_key: '6947140669a2426d82859a2efad5f296',
        email: email,
      },
    });

    const { status } = response.data;

    return status === 'valid';
  } catch (error) {
    console.error('Error validating email:', error);
    return false;
  }
}
