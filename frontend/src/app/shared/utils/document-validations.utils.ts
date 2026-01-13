import { AbstractControl, ValidationErrors } from '@angular/forms';

export class DocumentValidationsUtil {

  static noAccent(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const regex = /^[A-Za-z0-9._\- ]+$/;
    return regex.test(value) ? null : { accent: true };
  }

  static email(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const regex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return regex.test(value) ? null : { email: true };
  }

  static cpf(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value?.replace(/\D/g, '');
    if (!value) return null;

    return value.length === 11 ? null : { cpf: true };
  }

  static cnpj(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value?.replace(/\D/g, '');
    if (!value) return null;

    return value.length === 14 ? null : { cnpj: true };
  }
}
