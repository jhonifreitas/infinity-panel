import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }

  // CPF
  validateCPF(cpf: string): boolean {
    let digit_1 = 0;
    let digit_2 = 0;
    let valid = false;

    const regex = new RegExp('[0-9]{11}');

    if (
      cpf === '00000000000' ||
      cpf === '11111111111' ||
      cpf === '22222222222' ||
      cpf === '33333333333' ||
      cpf === '44444444444' ||
      cpf === '55555555555' ||
      cpf === '66666666666' ||
      cpf === '77777777777' ||
      cpf === '88888888888' ||
      cpf === '99999999999' ||
      !regex.test(cpf)
    ){
      valid = false;
    } else {
      for(let i = 0; i < 10; i++){
        digit_1 = i < 9 ? (digit_1 + (parseInt(cpf[i]) * (11-i-1))) % 11 : digit_1;
        digit_2 = (digit_2 + (parseInt(cpf[i]) * (11-i))) % 11;
      }

      valid = ((parseInt(cpf[9]) === (digit_1 > 1 ? 11 - digit_1 : 0)) && 
                (parseInt(cpf[10]) === (digit_2 > 1 ? 11 - digit_2 : 0)))
    }

    return valid;
  }

  cleanCPF(cpf: string): string {
    return cpf.replace(/\./gi, '').replace('-', '');
  }
}
