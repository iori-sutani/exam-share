export interface EmailValidator {
  validate(email: string): Promise<boolean>;
}
