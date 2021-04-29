import { FormControl } from '@angular/forms';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.scss']
})
export class InputFormComponent {

  @Input() id: string;
  @Input() hint: string;
  @Input() label: string;
  @Input() class: string;
  @Input() maxlength: number;
  @Input() inputmode: string;
  @Input() currency: boolean;
  @Input() showErrors: boolean;
  @Input() placeholder: string;
  @Input() control: FormControl;
  @Input() type: string = 'text';
  @Input() cdkFocus: boolean = false;
  @Input() disabled: boolean = false;
  @Input() showLabel: boolean = true;
  
  // MASK
  @Input() mask: { format: string; prefix: string; suffix: string; dropSpecialCharacters: boolean };

  // TEXTAREA
  @Input() rows: number = 1;
  
  // SELECT
  @Input() items: any[];
  @Input() multiple = false;
  @Input() selectId: string = 'name';

  // EVENT
  @Output() change = new EventEmitter();

  // CURRENCY
  currencyOpts = { prefix: 'R$ ', thousands: '.', decimal: ',', align: 'left' };

  // PASSWORD
  togglePass: boolean = true;

  constructor() { }

  emit(item: string, event?: any) {
    if (this[item]) this[item].emit(event);
  }
}
