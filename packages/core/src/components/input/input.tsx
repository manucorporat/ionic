import { Component, Element, Event, EventEmitter, Prop, PropDidChange } from '@stencil/core';

import { createThemedClasses } from '../../utils/theme';

import { InputComponent } from './input-base';

@Component({
  tag: 'ion-input',
  styleUrls: {
    ios: 'input.ios.scss',
    md: 'input.md.scss',
    wp: 'input.wp.scss'
  },
  host: {
    theme: 'input'
  }
})
export class Input implements InputComponent {
  mode: string;
  color: string;

  didBlurAfterEdit: boolean;
  styleTmr: number;

  @Element() el: HTMLElement;

  /**
   * @output {event} Emitted when the styles change.
   */
  @Event() ionStyle: EventEmitter;

  /**
   * @output {event} Emitted when the input no longer has focus.
   */
  @Event() ionBlur: EventEmitter;

  /**
   * @output {event} Emitted when the input has focus.
   */
  @Event() ionFocus: EventEmitter;

  /**
   * @input {string} If the value of the type attribute is `"file"`, then this attribute will indicate the types of files that the server accepts, otherwise it will be ignored. The value must be a comma-separated list of unique content type specifiers.
   */
  @Prop() accept: string;

  /**
   * @input {string} Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user. Defaults to `"none"`.
   */
  @Prop() autocapitalize: string = 'none';

  /**
   * @input {string} Indicates whether the value of the control can be automatically completed by the browser. Defaults to `"off"`.
   */
  @Prop() autocomplete: string = 'off';

  /**
   * @input {string} Whether autocorrection should be enabled when the user is entering/editing the text value. Defaults to `"off"`.
   */
  @Prop() autocorrect: string = 'off';

  /**
   * @input {string} This Boolean attribute lets you specify that a form control should have input focus when the page loads. Defaults to `false`.
   */
  @Prop() autofocus: boolean = false;

  /**
   * @input {boolean} If true and the type is `checkbox` or `radio`, the control is selected by default. Defaults to `false`.
   */
  @Prop() checked: boolean = false;

  /**
   * @hidden
   */
  @PropDidChange('checked')
  checkedChanged() {
    this.emitStyle();
  }


  /**
   * @input {boolean} If true, a clear icon will appear in the input when there is a value. Clicking it clears the input. Defaults to `false`.
   */
  @Prop() clearInput: boolean = false;

  /**
   * @input {boolean} If true, the value will be cleared after focus upon edit. Defaults to `true` when `type` is `"password"`, `false` for all other types.
   */
  @Prop({ mutable: true }) clearOnEdit: boolean;

  /**
   * @input {boolean} If true, the user cannot interact with this element. Defaults to `false`.
   */
  @Prop() disabled: boolean = false;

  /**
   * @hidden
   */
  @PropDidChange('disabled')
  disabledChanged() {
    this.emitStyle();
  }

  /**
   * @input {string} A hint to the browser for which keyboard to display. This attribute applies when the value of the type attribute is `"text"`, `"password"`, `"email"`, or `"url"`. Possible values are: `"verbatim"`, `"latin"`, `"latin-name"`, `"latin-prose"`, `"full-width-latin"`, `"kana"`, `"katakana"`, `"numeric"`, `"tel"`, `"email"`, `"url"`.
   */
  @Prop() inputmode: string;

  /**
   * @input {string} The maximum value, which must not be less than its minimum (min attribute) value.
   */
  @Prop() max: string;

  /**
   * @input {number} If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the maximum number of characters that the user can enter.
   */
  @Prop() maxlength: number;

  /**
   * @input {string} The minimum value, which must not be greater than its maximum (max attribute) value.
   */
  @Prop() min: string;

  /**
   * @input {number} If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the minimum number of characters that the user can enter.
   */
  @Prop() minlength: number;

  /**
   * @input {boolean} If true, the user can enter more than one value. This attribute applies when the type attribute is set to `"email"` or `"file"`, otherwise it is ignored.
   */
  @Prop() multiple: boolean;

  /**
   * @input {string} The name of the control, which is submitted with the form data.
   */
  @Prop() name: string;

  /**
   * @input {string} A regular expression that the value is checked against. The pattern must match the entire value, not just some subset. Use the title attribute to describe the pattern to help the user. This attribute applies when the value of the type attribute is `"text"`, `"search"`, `"tel"`, `"url"`, `"email"`, or `"password"`, otherwise it is ignored.
   */
  @Prop() pattern: string;

  /**
   * @input {string} Instructional text that shows before the input has a value.
   */
  @Prop() placeholder: string;

  /**
   * @input {boolean} If true, the user cannot modify the value. Defaults to `false`.
   */
  @Prop() readonly: boolean = false;

  /**
   * @input {boolean} If true, the user must fill in a value before submitting a form.
   */
  @Prop() required: boolean = false;

  /**
   * @input {number} This is a nonstandard attribute supported by Safari that only applies when the type is `"search"`. Its value should be a nonnegative decimal integer.
   */
  @Prop() results: number;

  /**
   * @input {string} If true, the element will have its spelling and grammar checked. Defaults to `false`.
   */
  @Prop() spellcheck: boolean = false;

  /**
   * @input {string} Works with the min and max attributes to limit the increments at which a value can be set. Possible values are: `"any"` or a positive floating point number.
   */
  @Prop() step: string;

  /**
   * @input {number} The initial size of the control. This value is in pixels unless the value of the type attribute is `"text"` or `"password"`, in which case it is an integer number of characters. This attribute applies only when the `type` attribute is set to `"text"`, `"search"`, `"tel"`, `"url"`, `"email"`, or `"password"`, otherwise it is ignored.
   */
  @Prop() size: number;

  /**
   * @input {string} The type of control to display. The default type is text. Possible values are: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, or `"url"`.
   */
  @Prop() type: string = 'text';

  /**
   * @input {string} The text value of the input.
   */
  @Prop({ mutable: true }) value: string;


  /**
   * @hidden
   * Update the native input element when the value changes
   */
  @PropDidChange('value')
  valueChanged() {
    const inputEl = this.el.querySelector('input');
    if (inputEl.value !== this.value) {
      inputEl.value = this.value;
    }
  }


  ionViewDidLoad() {
    this.emitStyle();

    // By default, password inputs clear after focus when they have content
    if (this.type === 'password' && this.clearOnEdit !== false) {
      this.clearOnEdit = true;
    }
  }

  private emitStyle() {
    clearTimeout(this.styleTmr);

    let styles = {
      'input': true,
      'input-checked': this.checked,
      'input-disabled': this.disabled,
      'input-has-value': this.hasValue(),
      'input-has-focus': this.hasFocus()
    };

    this.styleTmr = setTimeout(() => {
      this.ionStyle.emit(styles);
    });
  }


  /**
   * @hidden
   */
  inputBlurred(ev: any) {
    this.ionBlur.emit(ev);

    this.focusChange(this.hasFocus());
    this.emitStyle();
  }


  /**
   * @hidden
   */
  inputChanged(ev: any) {
    this.value = ev.target && ev.target.value;
    this.emitStyle();
  }


  /**
   * @hidden
   */
  inputFocused(ev: any) {
    this.ionFocus.emit(ev);

    this.focusChange(this.hasFocus());
    this.emitStyle();
  }


  /**
   * @hidden
   */
  focusChange(inputHasFocus: boolean) {
    // If clearOnEdit is enabled and the input blurred but has a value, set a flag
    if (this.clearOnEdit && !inputHasFocus && this.hasValue()) {
      this.didBlurAfterEdit = true;
    }
  }


  /**
   * @hidden
   */
  inputKeydown() {
    this.checkClearOnEdit();
  }


  /**
  * Check if we need to clear the text input if clearOnEdit is enabled
  * @hidden
  */
  checkClearOnEdit() {
    if (!this.clearOnEdit) {
      return;
    }

    // Did the input value change after it was blurred and edited?
    if (this.didBlurAfterEdit && this.hasValue()) {
      // Clear the input
      this.clearTextInput();
    }

    // Reset the flag
    this.didBlurAfterEdit = false;
  }

  /**
   * @hidden
   */
  clearTextInput() {
    this.value = '';
  }

  /**
   * @hidden
   */
  hasFocus(): boolean {
    // check if an input has focus or not
    return this.el && (this.el.querySelector(':focus') === this.el.querySelector('input'));
  }


  /**
   * @hidden
   */
  hasValue(): boolean {
    return (this.value !== null && this.value !== undefined && this.value !== '');
  }


  render() {
    const themedClasses = createThemedClasses(this.mode, this.color, 'text-input');
    // TODO aria-labelledby={this.item.labelId}

    return [
      <input
        aria-disabled={this.disabled ? 'true' : false}
        accept={this.accept}
        autoCapitalize={this.autocapitalize}
        autoComplete={this.autocomplete}
        autoCorrect={this.autocorrect}
        autoFocus={this.autofocus}
        checked={this.checked}
        disabled={this.disabled}
        inputMode={this.inputmode}
        min={this.min}
        max={this.max}
        minLength={this.minlength}
        maxLength={this.maxlength}
        multiple={this.multiple}
        name={this.name}
        pattern={this.pattern}
        placeholder={this.placeholder}
        results={this.results}
        readOnly={this.readonly}
        required={this.required}
        spellCheck={this.spellcheck}
        step={this.step}
        size={this.size}
        type={this.type}
        value={this.value}
        class={themedClasses}
        onBlur={this.inputBlurred.bind(this)}
        onInput={this.inputChanged.bind(this)}
        onFocus={this.inputFocused.bind(this)}
        onKeyDown={this.inputKeydown.bind(this)}
      />,
      <button
        hidden={this.clearInput !== true}
        class='text-input-clear-icon'
        onClick={this.clearTextInput.bind(this)}
        onMouseDown={this.clearTextInput.bind(this)}>
      </button>
    ];
  }
}
