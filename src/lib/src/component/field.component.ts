import {Component, ContentChild, Input} from '@angular/core';
import {RequiredValidator} from '@angular/forms';
import {FxModelDirective} from '../directive/fx-model.directive';
import {FormValidationMessageService} from '../service/form-validation-message.service';

@Component({
  selector: 'fx-field',
  template: `
    <div class="fx-field"
         [class.fx-field--required]="required"
         [class.fx-field--invalid]="invalid"
         [class.fx-field--pending-validation]="pending"
         [ngClass]="this.labelRelativePos">

    <label class="fx-field__label" [style.width.%]="labelWidth">{{label}}<span *ngIf="icon">
      <i class="fx-field__icon {{icon}}"></i>
    </span>
    </label>
      <div class="fx-field--inputAndError" [style.width.%]="inputWidth">
        <span class="fx-field__control"><ng-content></ng-content></span>
        <span *ngIf="invalid" class="fx-field__errors">
          <label *ngFor="let error of errors" class="fx-field__error">{{error}}</label>
        </span>
      </div>
    </div>
  `
})
export class FieldComponent {
  @Input() label: string;

  @Input() icon: string;

  @Input() labelRelativePos: LabelnputRelativeDisplayType;

  @Input() labelWidthPercentage: number;

  @ContentChild(RequiredValidator)
  private requiredValidator: RequiredValidator;

  @ContentChild(FxModelDirective)
  private formModel: FxModelDirective;

  constructor(private messageService: FormValidationMessageService) {
  }

  get value() {
    return this.formModel && this.formModel.value;
  }

  private get required() {
    return this.requiredValidator && this.requiredValidator.required;
  }

  private get valid() {
    return this.formModel &&
      (!this.formModel.groupSubmitted && this.formModel.pristine || this.formModel.valid);
  }

  private get invalid() {
    return !this.valid && !this.pending;
  }

  private get pending() {
    return this.formModel && this.formModel.pending;
  }

  private get errors() {
    if (this.formModel) {
      const errors = this.formModel.errors;
      return errors && Object.keys(errors).map(error =>
        this.messageService.getErrorMessage(this.label, error, errors[error]));
    }
  }

  private get labelWidth() {
    if(this.labelWidthPercentage
      && Number(this.labelWidthPercentage) >= 0 && Number(this.labelWidthPercentage) <= 100) {
      return this.labelWidthPercentage;
    }
  }

  private get inputWidth() {
    if(this.labelWidthPercentage
      && Number(this.labelWidthPercentage) >= 0 && Number(this.labelWidthPercentage) <= 100) {
      return 100 - Number(this.labelWidthPercentage);
    }
  }

}

export enum LabelnputRelativeDisplayType {
  LABEL_ON_TOP = 'label_on_top',
  LABEL_ON_BOTTOM = 'label_on_bottom',
  LABEL_ON_LEFT = 'label_on_left',
  LABEL_ON_RIGHT = 'label_on_right'
}
