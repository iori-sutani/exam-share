export abstract class EmailValidator {
  abstract validate(email: string): Promise<boolean>;
}
