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

_TODO: refactor Add formActions in DisplayForm to map the form actions rather than specify directly. And then update these docs_

### 1. <a id="AddFormActions"></a>Add formActions

Determine which form actions you need
 - submit
 - cancel
 - save and come back later **NOT YET ADDED TO CODE**

Determine which styling each requires
 - primary button (usually for main submit)
 - secondary button (usually for cancel)
 - text button (usually for save and come back later type submits)

Create an object of formActions for your form

```javascript
  const formActions = {
    submit: {
      className: 'govuk-button',
      dataModule: 'govuk-button',
      dataTestid: 'submit-button',
      label: 'Save',
      type: 'button',
    },
    cancel: {
      className: 'govuk-button--secondary',
      dataModule: 'govuk-button',
      dataTestid: 'submit-button',
      label: 'Cancel',
      type: 'button',
    }
  };
```

### 2. <a id="AddFormFields"></a>Add formFields

Create an object of formFields for your form

_For this example we'll add a text input of type text, a set of 3 radio buttons, and our new date input_

```javascript
const formFields = [
    {
      type: FIELD_TEXT,
      label: 'First name',
      hint: 'Enter your first name',
      fieldName: 'firstName',
    },
    {
      type: FIELD_RADIO,
      label: 'What is your favourite colour',
      fieldName: 'favouriteColour',
      className: 'govuk-radios',
      grouped: true,
      radioOptions: [
        {
          label: 'Red',
          name: 'favouriteColour',
          id: 'red',
          value: 'red',
          checked: CHECKED_FALSE
        },
        {
          label: 'Blue',
          name: 'favouriteColour',
          id: 'blue',
          value: 'blue',
          checked: CHECKED_FALSE
        },
        {
          label: 'Green',
          name: 'favouriteColour',
          id: 'green',
          value: 'green',
          checked: CHECKED_FALSE
        },
        {
          label: 'Other',
          name: 'favouriteColour',
          id: 'other',
          value: 'other',
          checked: CHECKED_FALSE
        },
      ],
    },
    {
      type: FIELD_DATE,
      label: 'Sample date field',
      hint: 'Enter a date',
      fieldName: 'myDate',
      grouped: true,
    },
  ];

  ```

### 3. <a id="AddValidationRules"></a>Add validation rules (if required)

Into your formField object, add any validation rules for each field.

Each field can take multiple rules, they're tested in the order you provide them and the first rule to fail is the one displayed to the user.

_NOTE: If you have a new type of validation, you can add it's rule to the `src/utils/Validator.jsx` file._

Example rule types
- VALIDATE_REQUIRED : field must not be empty
- VALIDATE_MIN_LENGTH : if field is not empty then it must have at least the specified number of characters in it
- VALIDATE_EMAIL_ADDRESS : if field is not empty, then it must match a regex test for including `@` and `.xx` where x is any letter

Validation objects must have a type and a message, and if there are additional conditions (such as min length) a condition.

_For this example we will require the text field to have a min length of 2 characters and the date field to be completed._

```javascript
const formFields = [
    {
      type: FIELD_TEXT,
      label: 'First name',
      hint: 'Enter your first name',
      fieldName: 'firstName',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your first name',
        },
        {
          type: VALIDATE_MIN_LENGTH,
          message: 'First name must be a minimum of 2 characters',
          condition: 2,
        },
      ],
    },
    {
      type: FIELD_RADIO,
      label: 'What is your favourite colour',
      fieldName: 'favouriteColour',
      className: 'govuk-radios',
      grouped: true,
      radioOptions: [
        {
          label: 'Red',
          name: 'favouriteColour',
          id: 'red',
          value: 'red',
          checked: CHECKED_FALSE
        },
        {
          label: 'Blue',
          name: 'favouriteColour',
          id: 'blue',
          value: 'blue',
          checked: CHECKED_FALSE
        },
        {
          label: 'Green',
          name: 'favouriteColour',
          id: 'green',
          value: 'green',
          checked: CHECKED_FALSE
        },
        {
          label: 'Other',
          name: 'favouriteColour',
          id: 'other',
          value: 'other',
          checked: CHECKED_FALSE
        },
      ],
    },
    {
      type: FIELD_DATE,
      label: 'Sample date field',
      hint: 'Enter a date',
      fieldName: 'myDate',
      grouped: true,
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your date',
        },
      ],
    },
  ];
```

### 4. <a id="AddHandleSubmit"></a>Add handleSubmit 

_TODO: Add an example API call once those are built_

Add your handleSubmit function. You need to include:
- calling the Validator and setting any errors it returns
- scrolling to the form element (so user is taken to where the errors display) if there are errors
- where to navigate to if there are not errors
- what to do with the data from the form (PATCH, POST, etc.)

If you use a confirmation page
- you must include the form name
- you must include the next page link and the name it relates to
- you *may* include a reference number if you have one available

```javascript
 const handleSubmit = async (e, formData) => {
    e.preventDefault();
    const formErrors = await Validator({ formData: formData.formData, formFields: formFields });
    setErrors(formErrors);

    if (formErrors.length < 1) {
      navigate(
        FORM_CONFIRMATION_URL,
        {
          state: {
            formName: 'Example form',
            nextPageLink: DASHBOARD_URL,
            nextPageName: DASHBOARD_PAGE_NAME,
            referenceNumber: referenceNumber
          }
        }
      );
    } else {
      scrollToElementId('formSecondPage');
    }
  };
```

### 5. <a id="AddHandleCancel"></a>Add handleCancel

_TODO: Add a handleCancel example_

### 6. <a id="AddDisplayForm"></a>Add <DisplayForm> to your return

Add the DisplayForm component to your return

```javascript
  return (
    <div className="govuk-grid-row">
      <h1>Second page</h1>
      <DisplayForm
        formId='formSecondPage'
        errors={errors}
        fields={formFields}
        formActions={formActions}
        handleSubmit={handleSubmit}
        setErrors={setErrors}
      />
    </div >
  );
```

### Your final page component will then look something like this:

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FIELD_DATE,
  FIELD_RADIO,
  FIELD_TEXT,
  CHECKED_FALSE,
  VALIDATE_MIN_LENGTH,
  VALIDATE_REQUIRED,
} from '../../constants/AppConstants';
import { DASHBOARD_PAGE_NAME, DASHBOARD_URL, FORM_CONFIRMATION_URL } from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/DisplayForm';
import { scrollToElementId } from '../../utils/ScrollToElementId';
import Validator from '../../utils/Validator';

const SecondPage = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState();
  const referenceNumber = '123';

  const formActions = {
    submit: {
      className: 'govuk-button',
      dataModule: 'govuk-button',
      dataTestid: 'submit-button',
      label: 'Save',
      type: 'button',
    },
    cancel: {
      className: 'govuk-button--secondary',
      dataModule: 'govuk-button',
      dataTestid: 'submit-button',
      label: 'Cancel',
      type: 'button',
    }
  };
  const formFields = [
    {
      type: FIELD_TEXT,
      label: 'First name',
      hint: 'Enter your first name',
      fieldName: 'firstName',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your first name',
        },
        {
          type: VALIDATE_MIN_LENGTH,
          message: 'First name must be a minimum of 2 characters',
          condition: 2,
        },
      ],
    },
    {
      type: FIELD_RADIO,
      label: 'What is your favourite colour',
      fieldName: 'favouriteColour',
      className: 'govuk-radios',
      grouped: true,
      radioOptions: [
        {
          label: 'Red',
          name: 'favouriteColour',
          id: 'red',
          value: 'red',
          checked: CHECKED_FALSE
        },
        {
          label: 'Blue',
          name: 'favouriteColour',
          id: 'blue',
          value: 'blue',
          checked: CHECKED_FALSE
        },
        {
          label: 'Green',
          name: 'favouriteColour',
          id: 'green',
          value: 'green',
          checked: CHECKED_FALSE
        },
        {
          label: 'Other',
          name: 'favouriteColour',
          id: 'other',
          value: 'other',
          checked: CHECKED_FALSE
        },
      ],
    },
    {
      type: FIELD_DATE,
      label: 'Sample date field',
      hint: 'Enter a date',
      fieldName: 'myDate',
      grouped: true,
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your date',
        },
      ],
    },
  ];

  const handleSubmit = async (e, formData) => {
    e.preventDefault();
    const formErrors = await Validator({ formData: formData.formData, formFields: formFields });
    setErrors(formErrors);

    if (formErrors.length < 1) {
      navigate(
        FORM_CONFIRMATION_URL,
        {
          state: {
            formName: 'Example form',
            nextPageLink: DASHBOARD_URL,
            nextPageName: DASHBOARD_PAGE_NAME,
            referenceNumber: referenceNumber
          }
        }
      );
    } else {
      scrollToElementId('formSecondPage');
    }
  };

  return (
    <div className="govuk-grid-row">
      <h1>Second page</h1>
      <DisplayForm
        formId='formSecondPage'
        errors={errors}
        fields={formFields}
        formActions={formActions}
        handleSubmit={handleSubmit}
        setErrors={setErrors}
      />
    </div >
  );
};

export default SecondPage;
```

----

## Structure Diagram

_Last updated November 2022_

<a href="https://github.com/UKHomeOffice/nmsw-ui/blob/main/docs/formComposerDiagram-preview.png"><img src="https://github.com/UKHomeOffice/nmsw-ui/blob/main/docs/formComposerDiagram-preview.png" alt="Form constructor diagram" title="Form constructor diagram" height="150" /></a>
