import { injectable, inject } from 'inversify';
import { filter } from 'ramda';
import { IValidator, IConfig } from 'interfaces';
import { CONFIG_TYPE } from 'types';

@injectable()
export class Validator implements IValidator {

  private errors = {};

  constructor(
    @inject(CONFIG_TYPE) private config: IConfig
  ) {

  }

  public valid(query: string, validators: any[][]): {isValid: boolean, errors: Object} {

    for (let validator of validators) {
      let [ name, ...params ] = validator;
      this.errors[name] = this[name](query, ...params);
    }

    let errors = filter(error => error !== null, <any>this.errors);
    let errorsLength = Object.keys(errors).length;
    let isValid = !Boolean(errorsLength)

    this.errors = {};

    return { isValid, errors: isValid ? null : errors };
  }

  private length(query: string, minLength: number, errorMessage: string): string {
    return query.length >= minLength ? null : errorMessage;
  }

  private email(query: string, errorMessage = 'Некорректный адрес электронной почты.'): string {
    let emailRegex = this.config.get<RegExp>('validators.email')
    return emailRegex.test(query) ? null : errorMessage;
  }
}
