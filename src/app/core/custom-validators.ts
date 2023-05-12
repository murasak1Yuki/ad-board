import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {


  static passwordsMatchValidator(
    form: AbstractControl
  ): ValidationErrors | null {
    const { password, passwordConfirmation } = form.value;
    const passwordConfirmationControl = form.get('passwordConfirmation');
    let passwordConfirmationControlErrors = passwordConfirmationControl!.errors;

    password === passwordConfirmation || (!password && !passwordConfirmation)
      ? delete passwordConfirmationControlErrors?.['passwordMismatch']
      : (passwordConfirmationControlErrors = {
        ...passwordConfirmationControlErrors,
        passwordMismatch: true,
      });

    passwordConfirmationControl?.setErrors(
      Object.keys(passwordConfirmationControlErrors ?? {}).length
        ? passwordConfirmationControlErrors
        : null
    );

    return null;
  }
}
