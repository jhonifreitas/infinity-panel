import { FormControl } from '@angular/forms';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.scss']
})
export class InputFormComponent {

  @Input() id: string;
  @Input() hint: string;
  @Input() type = 'text';
  @Input() label: string;
  @Input() class: string;
  @Input() cdkFocus = false;
  @Input() showLabel = true;
  @Input() maxlength: number;
  @Input() inputmode: string;
  @Input() placeholder: string;
  @Input() control: FormControl;

  // MASK
  @Input() mask: { format: string; prefix: string; suffix: string; dropSpecialCharacters: boolean };

  // TEXTAREA
  @Input() rows = 1;

  // DATEPICKER
  @Input() startView: 'month' | 'year' | 'multi-year' = 'month';

  // SELECT
  @Input() items: any[];
  @Input() selectId = 'id';
  @Input() multiple = false;
  @Input() selectName = 'name';

  // EVENT
  @Output() inputChange = new EventEmitter();

  // CURRENCY
  currencyOpts = { prefix: 'R$ ', thousands: '.', decimal: ',', align: 'left' };

  // PASSWORD
  togglePass = true;

  constructor() { }

  emit(item: string, event?: any) {
    if (this[item]) this[item].emit(event);
  }
}
