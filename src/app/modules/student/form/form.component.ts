import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';

import { Student } from 'src/app/models/student';
import { FileUpload } from 'src/app/interfaces/base';

import { UtilService } from 'src/app/services/util.service';
import { StudentService } from 'src/app/services/firebase/student.service';
import { ValidatorService } from 'src/app/services/validator.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class StudentFormComponent implements OnInit {

  saving = false;
  image: FileUpload;
  formGroup: FormGroup;
  genres = [
    {id: 'masc', name: 'Masculino'},
    {id: 'fem', name: 'Feminino'},
    {id: 'other', name: 'Outro'},
  ];
  civilStatus = [
    {id: 'single', name: 'Solteiro(a)'},
    {id: 'married', name: 'Casado(a)'},
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Student = new Student(),
    private _util: UtilService,
    private _student: StudentService,
    private formBuilder: FormBuilder,
    private _validator: ValidatorService,
    private dialogRef: MatDialogRef<StudentFormComponent>,
  ) {
    this.formGroup = this.formBuilder.group({
      linkedin: new FormControl(''),
      facebook: new FormControl(''),
      instagram: new FormControl(''),
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      genre: new FormControl('', Validators.required),
      cpf: new FormControl('', [Validators.required, this._validator.validatorCPF]),
      rg: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.required, Validators.minLength(11)]),
      placeBirth: new FormControl('', Validators.required),
      motherName: new FormControl('', Validators.required),
      civilStatus: new FormControl('', Validators.required),
      spouseName: new FormControl('', Validators.required),
      companyName: new FormControl('', Validators.required),
      companyPost: new FormControl('', Validators.required),
      higherCourse: new FormControl('', Validators.required),
      instituteCourse: new FormControl('', Validators.required),
      password: new FormControl(''),
      confirmPass: new FormControl(''),
    }, {validators: !this.data ? this.validatorPassword : null});
  }

  ngOnInit(): void {
    if (this.data) this.setData();
    else {
      this.controls.password.setValidators([Validators.required, Validators.minLength(6)]);
      this.controls.confirmPass.setValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  get controls() {
    return this.formGroup.controls;
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
    else if (confirmControl.hasError('minlength')) result = {minlength: confirmControl.errors.minlength};
    else if (password !== confirmControl.value) result = {passNotSame: true};

    confirmControl.setErrors(result);
    return null;
  }

  setData(): void {
    if (this.data.avatar) this.image = {path: this.data.avatar, new: false};
    this.formGroup.patchValue(this.data);
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
      delete value.confirmPass;
      Object.assign(this.data, value);

      await this._student.save(this.data).then(async id => {
        if (id) this.data.id = id;
        if (this.image && this.image.new && this.image.file) await this._student.uploadImage(this.data.id, this.image.file);
      });

      this.saving = false;
      this._util.message('Aluno salvo com sucesso!', 'success');
      this.dialogRef.close(true);
    } else this._util.message('Verifique os dados antes de salvar!', 'warn');
  }
}
