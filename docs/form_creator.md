# Form Creator

This app has an in built form creator with reusable components for if you wish to add more forms.

- [Create a new input type](#CreateInput)
- [Create a new form](#CreateForm)
  1. [Add formActions](#AddFormActions)
  2. [Add formFields](#AddFormFields)
  3. [Add validation rules (if required)](#AddValidationRunes)
  4. [Add handleSubmit ](#AddHandleSubmit)
  5. [Add handleCancel](#AddHandleCancel)
  6. [Add <DisplayForm> to your return](#AddDisplayForm)
- Structure diagram for reference (updated November 2022)
----

## <a id="CreateInput"></a>Create a new input type

Grouped inputs are inputs that require a fieldset, and use legend.
e.g. radio buttons, checkboxes, multiple grouped text inputs

This how to uses the date fieldset as an example

### 1. Create your input component

- Create a new file in `src/components/formFields/`
- Title it `Input` followed by the type of input e.g. `InputRadio.jsx` or `InputAddress.jsx`

In this example we created `InputDate.jsx`

Setup your PropTypes

Some prop types may not be required for this type of field, e.g. 
- inputMode is used for `InputDate.jsx` but not other fields.
- autocomplete and data-test-id is needed for `InputText.jsx`
- type is also needed for `InputText.jsx` as a text input could be a type of email, password, or regular text. But it is not needed for `InputDate` as a date input will always be text.

Example for Date fields (a grouped field)
```javascript
InputDate.propTypes = {
  fieldDetails: PropTypes.shape({
    fieldName: PropTypes.string.isRequired,
    hint: PropTypes.string,
    className: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
};
```

Create your component

```javascript
const InputDate = ({ fieldDetails, handleChange }) => {
  return (
    <div className="govuk-date-input" id={`${fieldDetails.fieldName}-input`}>
      <div className="govuk-date-input__item">
        <div className="govuk-form-group">
          <label className="govuk-label govuk-date-input__label" htmlFor="passport-issued-day">
            Day
          </label>
          <input
            className="govuk-input govuk-date-input__input govuk-input--width-2"
            id={`${fieldDetails.fieldName}-input-day`}
            name={`${fieldDetails.fieldName}-input-day`}
            type="text"
            inputMode="numeric"
            onChange={handleChange}
            aria-describedby={fieldDetails.hint ? `${fieldDetails.fieldName}-hint` : null}
          />
        </div>
      </div>
      <div className="govuk-date-input__item">
        <div className="govuk-form-group">
          <label className="govuk-label govuk-date-input__label" htmlFor="passport-issued-month">
            Month
          </label>
          <input
            className="govuk-input govuk-date-input__input govuk-input--width-2"
            id={`${fieldDetails.fieldName}-input-month`}
            name={`${fieldDetails.fieldName}-input-month`}
            type="text"
            inputMode="numeric"
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="govuk-date-input__item">
        <div className="govuk-form-group">
          <label className="govuk-label govuk-date-input__label" htmlFor="passport-issued-year">
            Year
          </label>
          <input
            className="govuk-input govuk-date-input__input govuk-input--width-4"
            id={`${fieldDetails.fieldName}-input-year`}
            name={`${fieldDetails.fieldName}-input-year`}
            type="text"
            inputMode="numeric"
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};
```

### 2. Add your input type to the switch statement on DetermineFieldType

Create a constant for your field type in `src/constants/AppConstants` and import it into `src/components/formFields/DetermineFieldType.jsx`

```javascript
export const FIELD_DATE = 'date';
```

Add an item to the switch statement

```javascript
...

switch (fieldDetails.type) {

    case FIELD_DATE: fieldToReturn =
      <InputDate
        error={error} // if error true, error styling applied to input
        fieldDetails={fieldDetails}
        handleChange={parentHandleChange}
      />;
      break;
...
```

----

## <a id="CreateForm"></a>Create a form

1. <a id="AddFormActions"></a>Add formActions
2. <a id="AddFormFields"></a>Add formFields
3. <a id="AddValidationRules"></a>Add validation rules (if required)
4. <a id="AddHandleSubmit"></a>Add handleSubmit 
5. <a id="AddHandleCancel"></a>Add handleCancel
6. <a id="AddDisplayForm"></a>Add <DisplayForm> to your return
