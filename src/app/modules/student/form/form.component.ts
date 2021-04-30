import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';

import { Student } from 'src/app/models/student';
import { City } from 'src/app/models/default/city';
import { State } from 'src/app/models/default/state';
import { Genre } from 'src/app/models/default/genre';
import { FileUpload } from 'src/app/interfaces/base';
import { CivilStatus } from 'src/app/models/default/civil-status';

import { UtilService } from 'src/app/services/util.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { ZipcodeService } from 'src/app/services/api/zipcode.service';
import { StudentService } from 'src/app/services/firebase/student.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class StudentFormComponent implements OnInit {

  saving = false;
  image: FileUpload;
  togglePass = true;
  states = State.all;
  genres = Genre.all;
  formGroup: FormGroup;
  courseCities: City[] = [];
  addressCities: City[] = [];
  data: Student = new Student();
  civilStatus = CivilStatus.all;

  constructor(
    private location: Location,
    private _util: UtilService,
    private _student: StudentService,
    private formBuilder: FormBuilder,
    private _zipcode: ZipcodeService,
    private _validator: ValidatorService
  ) {
    this.formGroup = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      genre: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.required, Validators.minLength(11)]),
      placeBirth: new FormControl('', Validators.required),
      civilStatus: new FormControl('', Validators.required),

      cpf: new FormControl('', [Validators.required, this._validator.validatorCPF]),
      rg: new FormControl('', Validators.required),
      rgEmitter: new FormControl('', Validators.required),

      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl(''),
      confirmPass: new FormControl(''),

      address: this.formBuilder.group({
        street: new FormControl('', Validators.required),
        number: new FormControl('', Validators.required),
        district: new FormControl('', Validators.required),
        city: new FormControl({value: '', disabled: true}, Validators.required),
        state: new FormControl('', Validators.required),
        zipcode: new FormControl('', Validators.required),
        complement: new FormControl(''),
      }),

      motherName: new FormControl('', Validators.required),
      spouseName: new FormControl('', Validators.required),

      company: this.formBuilder.group({
        name: new FormControl('', Validators.required),
        post: new FormControl('', Validators.required),
      }),

      course: this.formBuilder.group({
        name: new FormControl('', Validators.required),
        institute: new FormControl('', Validators.required),
        city: new FormControl({value: '', disabled: true}, Validators.required),
        state: new FormControl('', Validators.required),
        conclusion: new FormControl(''),
      }),

      social: this.formBuilder.group({
        linkedin: new FormControl(''),
        facebook: new FormControl(''),
        instagram: new FormControl(''),
      }),
    }, {validators: !this.data.id ? this.validatorPassword : null});
  }

  ngOnInit(): void {
    if (this.data.id) this.setData();
    else {
      this.controls.password.setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/[0-9]/),
        Validators.pattern(/[a-zA-Z]/),
        Validators.pattern(/[!@#$%&*()_=+;:,.?><\-]/)
      ]);
      this.controls.confirmPass.setValidators(Validators.required);
      this.controls.password.updateValueAndValidity();
      this.controls.confirmPass.updateValueAndValidity();
    }
  }

  setData(): void {
    if (this.data.image) this.image = {path: this.data.image, new: false};
    this.formGroup.patchValue(this.data);
  }

  get controls() {
    return this.formGroup.controls;
  }

  get addressControls() {
    return (this.controls.address as FormGroup).controls;
  }

  get companyControls() {
    return (this.controls.company as FormGroup).controls;
  }

  get courseControls() {
    return (this.controls.course as FormGroup).controls;
  }

  get socialControls() {
    return (this.controls.social as FormGroup).controls;
  }

  validatorPassword(group: FormGroup): ValidatorFn {
    const password = group.get('password').value;
    const confirmControl = group.get('confirmPass');
    let result: {
      required?: boolean;
      passNotSame?: boolean;
      minlength?: {actualLength: number; requiredLength: number};
    } = null;

    if (confirmControl.hasError('required')) result = {required: true};
    else if (password !== confirmControl.value) result = {passNotSame: true};

    confirmControl.setErrors(result);
    return null;
  }

  zipcodeChange() {
    const value: string = this.addressControls.zipcode.value;
    if (value.length === 8)
      this._zipcode.get(value).then(res => {
        this.addressControls.street.setValue(res.logradouro);
        this.addressControls.district.setValue(res.bairro);
        this.addressControls.city.setValue(res.localidade);
        this.addressControls.state.setValue(res.uf);
        if (res.complemento) this.addressControls.complement.setValue(res.complemento);
      }).catch(_ => {});
  }

  addressStateChange() {
    this.addressCities = new City().getByState(this.addressControls.state.value);
    if (this.addressCities.length) this.addressControls.city.enable();
    else this.addressControls.city.disable();
  }

  courseStateChange() {
    this.courseCities = new City().getByState(this.courseControls.state.value);
    if (this.courseCities.length) this.courseControls.city.enable();
    else this.courseControls.city.disable();
  }

  async takeImage(event: any): Promise<void> {
    const loader = this._util.loading('Comprimindo imagem...');
    const compress = await this._util.uploadCompress(event.addedFiles[0]);
    this.image = {path: compress.base64, file: compress.file, new: true};
    loader.componentInstance.msg = 'Imagem comprimida!';
    loader.componentInstance.done();
  }

  async deleteImage(): Promise<void> {
    if (!this.image.new)
      this._util.delete().then(async _ => {
        await this._student.deleteImage(this.data.id);
        this.image = null;
      }).catch(_ => {});
    else this.image = null;
  }

  async onSubmit(): Promise<void> {
    if (this.formGroup.valid) {
      this.saving = true;
      const value = this.formGroup.value;
      Object.assign(this.data, value);

      delete value.password;
      delete value.confirmPass;

      await this._student.save(this.data).then(async id => {
        if (id) this.data.id = id;
        if (this.image && this.image.new && this.image.file) await this._student.uploadImage(this.data.id, this.image.file);
      });

      this.saving = false;
      this._util.message('Aluno salvo com sucesso!', 'success');
      this.goToBack();
    } else this._util.message('Verifique os dados antes de salvar!', 'warn');
  }

  goToBack() {
    this.location.back();
  }
}
