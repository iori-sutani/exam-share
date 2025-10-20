import axios from 'axios';

export async function checkEmailValidity(email: string): Promise<boolean> {
  try {
    const response = await axios.post('/api/validate-email', { email });
    return response.data.isValid;
  } catch (error) {
    console.error('Error checking email validity:', error);
    return false;
  }
}
