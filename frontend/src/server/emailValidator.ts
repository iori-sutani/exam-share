
// テスト用: 00000000@ed.tmu.ac.jpならOK
export async function validateEmail(email: string): Promise<boolean> {
  return email === '00000000@ed.tmu.ac.jp';
}
