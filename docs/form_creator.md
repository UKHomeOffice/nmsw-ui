# Form Creator

This app has an in built form creator with reusable components for if you wish to add more forms.

## DisplayForm
- [Display Form](#display-form)

## Field actions
- [Form action options](#form-action-options)

## Field types
Standard inputs
- [Autocomplete](#autocomplete)
- [Radio buttons](#radio-buttons)
- [Radio buttons with conditional text field(s)](#conditionals)
- [Text input](#text-input)

Specific inputs
- TODO: [Date](#date)
- [Email](#email)
- [Password](#password)
- [Phone Number](#phone-number)

Validating fields
- [required](#required)
- [Conditional](#conditional)
- [Email Format](#email-format)
- [Match](#match)
- [Minimum Length](#minimum-length)
- [Phone Number Format](#phone-number-format)


## Other guides
- <a href="https://github.com/UKHomeOffice/nmsw-ui/blob/main/docs/form_creator_example.md">Create a new form - step by step example</a>
- <a href="https://github.com/UKHomeOffice/nmsw-ui/blob/main/docs/form_creator_new_input_type.md">Creating a new input type</a>
- [Structure diagram for reference](#StructureDiagram) (updated November 2022)
----

## Display Form

Structure:
```javascript
<DisplayForm
  formId=<required>
  fields={formFields}
  formActions={formActions}
  formType=<required>
  pageHeading=<required>
  handleSubmit={handleSubmit}
/>
```

You can also pass children to the component
e.g. if you have a SupportingText component you would pass as follows:
```javascript
<DisplayForm
  formId=<required>
  fields={formFields}
  formActions={formActions}
  formType=<required>
  pageHeading=<required>
  handleSubmit={handleSubmit}
>
  <SupportingText />
</DisplayForm>
```

Parameters

### formId
An identifier for your form element

### formFields
Must always be {formFields} which you must define within the component that is calling the DisplayForm component. (see Field Types)

### formAction
Must always be {formAction} which you must define within the component that is calling the DisplayForm component. (see Form Action Options)

### formType
Can be SINGLE_PAGE_FORM - if the form has one page. This will clear any session data for the form when `submit` or `back` are clicked
Or MULTI_PAGE_FORM - if the form has multiple pages. This will persist session data as the user moves through the form and only clear it when they go to another section of the site.

When using MULTI_PAGE_FORM you should add a `sessionStorage.removeItem('formData')` within the handleSubmit of the last page of your form.

### pageHeading
What will be the h1 of your page. We have to pass it to the form to display as any error summary is shown ABOVE the h1

### handleSubmit
Your handleSubmit action from the page

----

## Form Action Options

TODO:
- dataModule: remove from the parameters and code into the DisplayForm button section as it is always govuk-button
- dataTestid: remove from the parameters and code, it shouldn't be needed as we can use type for finding button
- type: remove from the parameters and code, it should always be button
- replace using govuk-button className with buttonPrimary constant
- replace using govuk-button govuk-button--secondary with buttonSecondary constant

Requirements:

Your `Page` must contain 
- a `handleSubmit` function for submit actions
- a `handleCancel` function for cancel actions (optional)

Object structure:

```
<action>: {
  className: <required>,
  label: <required>,
}
```
If cancel button:
```
<action>: {
  label: <required>,
  redirectURL: <required>,
}
```

Parameters:

### action
- submit : triggers the `handleSubmit` function from your parent `Page`
- cancel: triggers the `handleCancel` function from your parent `Page`

### label
The words you wish to show on your button

### redirectURL
The page you want to redirect the user to if they click cancel

----

## Autocomplete

Requirements

- The API endpoint that allows GETting the data for this field. It must be an endpoint that allows for search/filter based on a string passed to it

Object structure

```
{
  type: FIELD_AUTOCOMPLETE,
  dataAPIEndpoint: <required>,
  fieldName: <required>,
  hint: <optional>
  label: <required>,
  responseKey: <required>,
  additionalKey: <OPTIONAL: additional data key>,
}
```

Parameters

### type
Import and use `FIELD_AUTOCOMPLETE` from `src/constants/AppConstants`

### dataAPIEndpoint
The url for the API where we can get the list of options to display within the autocomplete field.
It must be an endpoint setup to allow for search/filter based on what the user has typed into the autocomplete field.

### fieldName
A string that will be used for `name` and to create `id` and other field references.

### hint (optional)
An optional string

### label
A string that will be shown as the question/label text for the field

### responseKey
The key from the API data set returned that lets us find the value to display in the input (e.g. `name` )

### additionalResponseKey (optional)
An additional key if two fields are required to create a name (e.g. key: `name` and additionalKey: `unlocode` for ports)

----

## Radio Buttons

TODO:
- replace using the className of `govuk-radios` or `govuk-radios govuk-radios--inline` with constants for vertical/horizontal
- replace need for specifying grouped = true and build that into the DetermineFieldType switch statement for ease (radio buttons are always grouped)
- use `fieldName` to add the name to the option in InputRadio.jsx, removing the need to repeat it in each radioOption

Requirements

n/a

Object structure

```
{
  type: FIELD_RADIO,
  className: <required>,
  fieldName: <required>,
  grouped: true,
  hint: <optional>
  label: <required>,
  radioOptions: [
    {
      label: <required>,
      name: <required>,
      value: <required>,
      checked: <optional>
    },
  ],
},
```

Parameters

### type
Import and use `FIELD_RADIO` from `src/constants/AppConstants`

### className
Radio buttons can be aligned vertically (`govuk-radios`) or horizontally (`govuk-radios govuk-radios--inline`)

### fieldName
A string that will be used for `name` and to create `id` and other field references.

### grouped
Always specify this as `true` as radio buttons are grouped inputs and use a different fieldset/label html structure.
This is defined within `src/components/formFields/DetermineFieldType` and at some point we will refactor this so that `grouped: true` does not need to be specified within the field object

### hint (optional)
An optional string

### label
A string that will be shown as the question/label text for the field

### radioOptions
- label: A string that will be shown as the associated label text for the field
- name: must be the same as `fieldName` as it is the name of the radio button set
- value: The value that will be stored and used if the radio button is checked
- checked: optional, if set to `true` then the radio button will default to checked on render

----

## Conditional

A list of radio buttons where one or more of the radio options can have an associated text input. The text input is only shown/validated/value stored if it's assocaited radio button is checked.

TODO:
- replace using the className of `govuk-radios` or `govuk-radios govuk-radios--inline` with constants for vertical/horizontal
- replace need for specifying grouped = true and build that into the DetermineFieldType switch statement for ease (radio buttons are always grouped)
- use `fieldName` to add the name to the option in InputRadio.jsx, removing the need to repeat it in each radioOption

Requirements

n/a

Object structure

```
{
  type: FIELD_CONDITIONAL,
  className: <required>,
  fieldName: <required>,
  grouped: true,
  hint: <optional>,
  label: <required>,
  radioOptions: [
    {
      radioField: <required>,
      label: <required>,
      name: <required>,
      value: <required>,
    },
    {
      radioField: <required>,
      parentFieldValue: <required>,
      hint: <optional>,
      label: <required>,
      name: <required>,
    },
  ],
},
```

Parameters

### type
Import and use `FIELD_CONDITIONAL` from `src/constants/AppConstants`

### className
Radio buttons can be aligned vertically (`govuk-radios`) or horizontally (`govuk-radios govuk-radios--inline`)

### fieldName
A string that will be used for `name` and to create `id` and other field references.

### grouped
Always specify this as `true` as radio buttons are grouped inputs and use a different fieldset/label html structure.
This is defined within `src/components/formFields/DetermineFieldType` and at some point we will refactor this so that `grouped: true` does not need to be specified within the field object

### hint (optional)
An optional string

### label
A string that will be shown as the question/label text for the field

### radioOptions : radio button
- radioField: set to `true` for this option to be a radio button
- label: A string that will be shown as the associated label text for the field
- name: must be the same as `fieldName` as it is the name of the radio button set
- value: The value that will be stored and used if the radio button is checked

### radioOptions : conditional text input
- radioField: set to `false` for this option to be a conditional text input
- parentFieldValue: the `value` from the associated parent field, this allows us to show/hide/store this field only when parent field is checked
- hint: (optional) An optional string
- label: a string that will be shown as the question/label text for the field
- name: a string that will be used for `name` and to create `id` and other field references


----

## Text Input

Requirements

n/a

Object structure

```
{
  type: FIELD_TEXT,
  fieldName: <required>,
  hint: <optional>,
  label: <required>
}
```

Parameters

### type
Import and use `FIELD_TEXT` from `src/constants/AppConstants`

### fieldName
A string that will be used for `name` and to create `id` and other field references.

### hint (optional)
An optional string

### label
A string that will be shown as the question/label text for the field

----

## Email

Requirements

n/a

Object structure

```
{
  type: FIELD_EMAIL,
  fieldName: <required>,
  hint: <optional>,
  label: <required>
}
```

Parameters

### type
Import and use `FIELD_EMAIL` from `src/constants/AppConstants`

### fieldName
A string that will be used for `name` and to create `id` and other field references.

### hint (optional)
An optional string

### label
A string that will be shown as the question/label text for the field

----

## Password

Requirements

n/a

Object structure

```
{
  type: FIELD_PASSWORD,
  fieldName: <required>,
  hint: <optional>,
  label: <required>
}
```

Parameters

### type
Import and use `FIELD_PASSWORD` from `src/constants/AppConstants`

### fieldName
A string that will be used for `name` and to create `id` and other field references.

### grouped
Always specify this as `true` as phone number fields are grouped inputs and use a different fieldset/label html structure.
This is defined within `src/components/formFields/DetermineFieldType` and at some point we will refactor this so that `grouped: true` does not need to be specified within the field object

### hint (optional)
An optional string

### label
A string that will be shown as the question/label text for the field

----

## Phone Number

Requirements

n/a

Object structure

```
{
  type: FIELD_PHONE,
  fieldName: <required>,
  hint: <optional>,
  label: <required>
}
```

Parameters

### type
Import and use `FIELD_PHONE` from `src/constants/AppConstants`
We use FIELD_PHONE as it provides a specific layout and handles separating the country code from the rest of the phone number, as well as reformatting the number for use within two inputs in the UI as the API will return a single string (with specific formatting)

You should always include phone number validation with a phone number field

### fieldName
A string that will be used for `name` and to create `id` and other field references.

### hint (optional)
An optional string

### label
A string that will be shown as the question/label text for the field

----

## Validating Fields
If a field requires validation you add a validation array to the field object.
A field can have no validation array (no rules), an array with one object (rule), or an array with multiple objects (rules)

1. [Rules](#rules)
- [Required](#required)
- [Conditional](#conditional)
- [Email Format](#email-format)
- [Match](#match)
- [Minimum Length](#minimum-length)
- [Phone Number Format](#phone-number-format)
2. [Examples](#examples)


### Rules

#### Required
Field is a mandatory field and cannot be nul

```
{
  type: VALIDATE_REQUIRED,
  message: <error message to show in UI>
}
```

#### Conditional
Field is a conditional field and has one or more rules to be validated if that conditional field is visible (i.e. it's parent radio is checked).
The validation is run based on the rules entered in the nested `condition` object.

```
{
  type: VALIDATE_CONDITIONAL,
  condition: {
    parentValue: <value of parent field>,
    fieldName: <this conditional field's name>,
    ruleToTest: <rule constant>,
    message: <error message to show in UI>
  },
}
```

#### Email Format
Specifically tests if the value entered matches an email pattern.
This test only runs if there is a value in the field and is ignored if field is null.

```
{
  type: VALIDATE_EMAIL,
  message: <error message to show in UI>
  },
}
```

#### Match
Specifically tests if the value entered matches the value of another field.

```
{
  type: VALIDATE_MATCH,
  message: <error message to show in UI>,
  condition: <field name to match>
  },
}
```

#### Minimum Length
Specifically tests if the length of the value entered is > the number specified in the `conditions` entry.
This test only runs if there is a value in the field and is ignored if field is null.

```
{
  type: VALIDATE_MIN_LENGTH,
  condition: <minimum length>
  message: <error message to show in UI>
  },
}
```

#### Phone Number Format
Specifically tests if the value entered matches the API required phone number pattern.
This test only runs if there is a value in the field and is ignored if field is null.

```
{
  type: VALIDATE_PHONE_NUMBER,
  message: <error message to show in UI>
  },
}
```


### Examples

e.g.
```
{
  type: FIELD_TEXT,
  label: 'First name',
  fieldName: 'firstName',
  validation: [
    {
      type: VALIDATE_REQUIRED,
      message: 'Enter your first name',
    },
  ],
},
```

There can be multiple validation rules objects per field, all are placed within the validation array

e.g.
```
{
  type: FIELD_CONDITIONAL,
  label: 'What is your favourite animal',
  fieldName: 'favAnimal',
  className: 'govuk-radios',
  grouped: true,
  radioOptions: [
    {
      radioField: true,
      label: 'Cat',
      name: 'favAnimal',
      value: 'cat',
    },
    {
      radioField: false,
      parentFieldValue: 'cat',
      label: 'Breed of cat',
      name: 'breedOfCat',
    },
    {
      radioField: true,
      label: 'Dog',
      name: 'favAnimal',
      value: 'dog',
    },
  ],
  validation: [
    {
      type: VALIDATE_REQUIRED,
      message: 'Select your favourite animal',
    },
    {
      type: VALIDATE_CONDITIONAL,
      condition: {
        parentValue: 'cat',
        fieldName: 'breedOfCat',
        ruleToTest: VALIDATE_REQUIRED,
        message: 'Enter a breed of cat'
      },
    }
  ],
}
```

----
## Structure Diagram

_Last updated November 2022_

<a href="https://raw.githubusercontent.com/UKHomeOffice/nmsw-ui/main/docs/formComposerDiagram.png"><img src="https://raw.githubusercontent.com/UKHomeOffice/nmsw-ui/main/docs/formComposerDiagram.png" alt="Form constructor diagram" title="Form constructor diagram" height="150" /></a>
