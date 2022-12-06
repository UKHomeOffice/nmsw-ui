import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DisplayForm from '../DisplayForm';
import {
  FIELD_AUTOCOMPLETE,
  FIELD_CONDITIONAL,
  FIELD_EMAIL,
  FIELD_PASSWORD,
  FIELD_RADIO,
  FIELD_TEXT,
  SINGLE_PAGE_FORM,
  VALIDATE_CONDITIONAL,
  VALIDATE_EMAIL_ADDRESS,
  VALIDATE_MIN_LENGTH,
  VALIDATE_REQUIRED,
  } from '../../constants/AppConstants';

/*
 * These tests check that we can pass a variety of
 * form field objects, and form action objects
 * to the display component
 * and it will return HTML that will display a full form
 * including labels, hints, inputs, buttons based on what we
 * pass in
 * It does NOT test a specific form structure or wording
 * (that is done on the page that hold the specific form)
 */

describe('Display Form', () => {
  const handleSubmit = jest.fn();
  let scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
  const formActions = {
    submit: {
      className: 'govuk-button',
      dataModule: 'govuk-button',
      dataTestid: 'submit-button',
      label: 'Submit test button',
      type: 'button',
    },
    cancel: {
      className: 'govuk-button govuk-button--secondary',
      dataModule: 'govuk-button',
      dataTestid: 'cancel-button',
      label: 'Cancel test button',
      type: 'button',
    }
  };
  const formActionsSubmitOnly = {
    submit: {
      className: 'govuk-button',
      dataModule: 'govuk-button',
      dataTestid: 'submit-button',
      label: 'Submit test button',
      type: 'button',
    },
  };
  const formRequiredAutocompleteInput = [
    {
      type: FIELD_AUTOCOMPLETE,
      label: 'Autocomplete input',
      fieldName: 'items',
      hint: 'Hint for Autocomplete input',
      dataAPIEndpoint: [
        {
          name: 'ObjectOne',
          identifier: 'one'
        },
        {
          name: 'ObjectTwo',
          identifier: 'two'
        },
        {
          name: 'ObjectThree',
          identifier: 'three'
        },
      ], // for while we're passing in a mocked array of data
      responseKey: 'name',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Select your Autocomplete input item',
        },
      ],
    },
  ];
  const formRequiredConditionalTextInput = [
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
        {
          radioField: false,
          parentFieldValue: 'dog',
          hint: 'What sort of dogs do you like?',
          label: 'Breed of dog',
          name: 'breedOfDog',
        },
        {
          radioField: true,
          label: 'Rabbit',
          name: 'favAnimal',
          value: 'rabbit',
        },
        {
          radioField: true,
          label: 'Other',
          name: 'favAnimal',
          value: 'other',
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
            parentValue: 'dog',
            fieldName: 'breedOfDog',
            ruleToTest: VALIDATE_REQUIRED,
            message: 'Enter a breed of dog'
          },
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
    },
  ];
  const formRequiredTextInput = [
    {
      type: FIELD_TEXT,
      label: 'Text input',
      hint: 'This is a hint for a text input',
      fieldName: 'testField',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your text input value',
        },
      ],
    }
  ];
  const formMinimumLengthTextInput = [
    {
      type: FIELD_TEXT,
      label: 'Text input',
      fieldName: 'testField',
      validation: [
        {
          type: VALIDATE_MIN_LENGTH,
          message: 'Field must be a minimum of 8 characters',
          condition: 8,
        },
      ],
    }
  ];
  const formRequiredRadioInput = [
    {
      type: FIELD_RADIO,
      label: 'This is a radio button set',
      fieldName: 'radioButtonSet',
      className: 'govuk-radios',
      grouped: true,
      hint: 'radio hint',
      radioOptions: [
        {
          label: 'Radio one',
          name: 'radioButtonSet',
          id: 'radioOne',
          value: 'radioOne',
          checked: true
        },
        {
          label: 'Radio two',
          name: 'radioButtonSet',
          id: 'radioTwo',
          value: 'radioTwo',
          checked: false
        },
        {
          label: 'Radio three',
          name: 'radioButtonSet',
          id: 'radioThree',
          value: 'radioThree',
          checked: false
        },
      ],
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Select your radio option',
        },
      ],
    },
  ];
  const formMultipleValidationRules = [
    {
      type: FIELD_TEXT,
      label: 'Text input',
      fieldName: 'testField',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your text input value',
        },
        {
          type: VALIDATE_MIN_LENGTH,
          message: 'Field must be a minimum of 8 characters',
          condition: 8,
        },
      ],
    }
  ];
  const formSpecialInputs = [
    {
      type: FIELD_TEXT,
      label: 'Text input',
      hint: 'This is a hint for a text input',
      fieldName: 'testField',
    },
    {
      type: FIELD_EMAIL,
      label: 'Email input',
      hint: 'This is a hint for an email input',
      fieldName: 'email',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your email address',
        },
        {
          type: VALIDATE_EMAIL_ADDRESS,
          message: 'Enter your email address in the correct format, like name@example.com',
        },
      ],
    },
    {
      type: FIELD_PASSWORD,
      label: 'Password input',
      hint: 'This is a hint for a password input',
      fieldName: 'password',
    }
  ];
  const formWithMultipleFields = [
    {
      type: FIELD_AUTOCOMPLETE,
      label: 'Autocomplete input',
      fieldName: 'items',
      hint: 'Hint for Autocomplete input',
      dataAPIEndpoint: [
        {
          name: 'ObjectOne',
          identifier: 'one'
        },
        {
          name: 'ObjectTwo',
          identifier: 'two'
        },
        {
          name: 'ObjectThree',
          identifier: 'three'
        },
      ], // for while we're passing in a mocked array of data
      responseKey: 'name',
    },
    {
      type: FIELD_TEXT,
      label: 'Text input',
      hint: 'This is a hint for a text input',
      fieldName: 'testField',
    },
    {
      type: FIELD_PASSWORD,
      label: 'Password',
      fieldName: FIELD_PASSWORD,
    },
    {
      type: FIELD_RADIO,
      label: 'This is a radio button set',
      fieldName: 'radioButtonSet',
      className: 'govuk-radios',
      grouped: true,
      hint: 'radio hint',
      radioOptions: [
        {
          label: 'Radio one',
          name: 'radioButtonSet',
          id: 'radioOne',
          value: 'radioOne',
          checked: false
        },
        {
          label: 'Radio two',
          name: 'radioButtonSet',
          id: 'radioTwo',
          value: 'radioTwo',
          checked: false
        },
      ]
    },
    {
      type: FIELD_CONDITIONAL,
      className: 'govuk-radios',
      label: 'This is a radio set with a conditional field',
      fieldName: 'radioWithConditional',
      hint: 'Hint for conditional set',
      grouped: true,
      radioOptions: [
        {
          radioField: true,
          label: 'Option that has a conditional',
          name: 'radioWithConditional',
          value: 'optionWithConditional',
        },
        {
          radioField: false,
          parentFieldValue: 'optionWithConditional',
          label: 'Conditional text input',
          name: 'conditionalTextInput',
        },
        {
          radioField: true,
          label: 'Option without a conditional',
          name: 'radioWithConditional',
          value: 'optionNoConditional',
        },
      ],
    }
  ];

  beforeEach(() => {
    window.sessionStorage.clear();
  });

  // ACTION BUTTONS
  it('should render a submit and cancel button if both exist', () => {
    render(
      <DisplayForm
        formId="testForm"
        fields={formRequiredTextInput}
        formActions={formActions}
        formType={SINGLE_PAGE_FORM}
        handleSubmit={handleSubmit}
      />
    );
    expect((screen.getByTestId('submit-button')).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Submit test button</button>');
    expect((screen.getByTestId('cancel-button')).outerHTML).toEqual('<button type="button" class="govuk-button govuk-button--secondary" data-module="govuk-button" data-testid="cancel-button">Cancel test button</button>');
  });

  it('should render only a submit button if there is no cancel button', () => {
    render(
      <DisplayForm
        formId="testForm"
        fields={formRequiredTextInput}
        formActions={formActionsSubmitOnly}
        formType={SINGLE_PAGE_FORM}
        handleSubmit={handleSubmit}
      />
    );
    expect(screen.getByTestId('submit-button').outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Submit test button</button>');
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('should call handleSubmit function if submit button is clicked and there are no errors', async () => {
    const user = userEvent.setup();
    render(
      <DisplayForm
        formId="testForm"
        fields={formRequiredTextInput}
        formActions={formActionsSubmitOnly}
        formType={SINGLE_PAGE_FORM}
        handleSubmit={handleSubmit}
      />
    );

    await user.type(screen.getByLabelText('Text input'), 'Hello');
    expect(screen.getByTestId('submit-button').outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Submit test button</button>');
    expect(screen.getAllByRole('button')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: 'Submit test button' }));
    expect(handleSubmit).toHaveBeenCalled();
  });

  // INPUTS
  it('should render an autocomplete input', async () => {
    render(
      <DisplayForm
        formId="testForm"
        fields={formRequiredAutocompleteInput}
        formActions={formActionsSubmitOnly}
        formType={SINGLE_PAGE_FORM}
        handleSubmit={handleSubmit}
      />
    );
    expect(screen.getByLabelText('Autocomplete input')).toBeInTheDocument();
    expect(screen.getByText('Hint for Autocomplete input').outerHTML).toEqual('<div id="items-hint" class="govuk-hint">Hint for Autocomplete input</div>');
    expect(screen.getByRole('combobox', { name: 'Autocomplete input' })).toBeInTheDocument();
    expect(screen.getByRole('listbox', { name: '' })).toBeInTheDocument();
  });

  it('should render a radio button input', () => {
    render(
      <DisplayForm
        formId="testForm"
        fields={formRequiredRadioInput}
        formActions={formActionsSubmitOnly}
        formType={SINGLE_PAGE_FORM}
        handleSubmit={handleSubmit}
      />
    );
    expect(screen.getByText('This is a radio button set')).toBeInTheDocument();
    expect(screen.getByText('radio hint').outerHTML).toEqual('<div id="radioButtonSet-hint" class="govuk-hint">radio hint</div>');
    expect(screen.getByLabelText('Radio one')).toBeInTheDocument();
    expect(screen.getByLabelText('Radio two')).toBeInTheDocument();
    expect(screen.getByLabelText('Radio three')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Radio one' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Radio two' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Radio three' })).toBeInTheDocument();
  });

  it('should render a radio button set with conditional fields input', () => {
    render(
      <DisplayForm
        formId="testForm"
        fields={formWithMultipleFields}
        formActions={formActionsSubmitOnly}
        formType={SINGLE_PAGE_FORM}
        handleSubmit={handleSubmit}
      />
    );
    expect(screen.getByText('This is a radio set with a conditional field')).toBeInTheDocument();
    expect(screen.getByText('Hint for conditional set').outerHTML).toEqual('<div id="radioWithConditional-hint" class="govuk-hint">Hint for conditional set</div>');
    expect(screen.getByLabelText('Option that has a conditional')).toBeInTheDocument();
    expect(screen.getByLabelText('Conditional text input')).toBeInTheDocument();
    expect(screen.getByLabelText('Option without a conditional')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Option that has a conditional' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Option without a conditional' })).toBeInTheDocument();
    expect(screen.queryByRole('radio', { name: 'Conditional text input' })).not.toBeInTheDocument(); // tests the text field isn't displayed as radio
  });

  it('should render a text input', () => {
    render(
      <DisplayForm
        formId="testForm"
        fields={formRequiredTextInput}
        formActions={formActionsSubmitOnly}
        formType={SINGLE_PAGE_FORM}
        handleSubmit={handleSubmit}
      />
    );
    expect(screen.getByLabelText('Text input')).toBeInTheDocument();
    expect(screen.getByText('This is a hint for a text input').outerHTML).toEqual('<div id="testField-hint" class="govuk-hint">This is a hint for a text input</div>');
    expect(screen.getByRole('textbox', { name: 'Text input' })).toBeInTheDocument();
  });

  it('should render the special input types', () => {
    render(
      <DisplayForm
        formId="testForm"
        fields={formSpecialInputs}
        formActions={formActionsSubmitOnly}
        formType={SINGLE_PAGE_FORM}
        handleSubmit={handleSubmit}
      />
    );
    /* standard text field */
    expect(screen.getByLabelText('Text input')).toBeInTheDocument();
    expect(screen.getByText('This is a hint for a text input').outerHTML).toEqual('<div id="testField-hint" class="govuk-hint">This is a hint for a text input</div>');
    expect(screen.getByRole('textbox', { name: 'Text input' })).toBeInTheDocument();
    /* email field */
    expect(screen.getByLabelText('Email input')).toBeInTheDocument();
    expect(screen.getByText('This is a hint for an email input').outerHTML).toEqual('<div id="email-hint" class="govuk-hint">This is a hint for an email input</div>');
    expect(screen.getByRole('textbox', { name: 'Email input' })).toBeInTheDocument();
    /* password field: password inputs do not have a true textbox role so must be found via test id */
    expect(screen.getByLabelText('Password input')).toBeInTheDocument();
    expect(screen.getByText('This is a hint for a password input').outerHTML).toEqual('<div id="password-hint" class="govuk-hint">This is a hint for a password input</div>');
    expect(screen.getByTestId('password-passwordField')).toBeInTheDocument();
  });

  it('should store expanded data if it is provided from an autocomplete field', async () => {
    const user = userEvent.setup();
    const expectedStoredData = '{"testField":"Hello","radioButtonSet":"radioTwo","items":"ObjectTwo","itemsExpandedDetails":{"items":{"name":"ObjectTwo","identifier":"two"}}}';
    render(
      <DisplayForm
        formId="testForm"
        fields={formWithMultipleFields}
        formActions={formActionsSubmitOnly}
        formType={SINGLE_PAGE_FORM}
        handleSubmit={handleSubmit}
      />
    );
    await user.type(screen.getByLabelText('Text input'), 'Hello');
    expect(screen.getByLabelText('Text input')).toHaveValue('Hello');
    await user.click(screen.getByRole('radio', { name: 'Radio two' }));
    expect(screen.getByRole('radio', { name: 'Radio two' })).toBeChecked();
    await user.type(screen.getByRole('combobox', { name: 'Autocomplete input' }), 'Object');
    await user.click(screen.getByText('ObjectTwo'));
    expect(screen.getByRole('combobox', { name: 'Autocomplete input' })).toHaveValue('ObjectTwo');

    expect(window.sessionStorage.getItem('formData')).toStrictEqual(expectedStoredData);
  });

  // ERRORS
  it('should render error summary & field error if there are field errors', async () => {
    const user = userEvent.setup();
    render(
      <DisplayForm
        formId="testForm"
        fields={formRequiredTextInput}
        formActions={formActionsSubmitOnly}
        formType={SINGLE_PAGE_FORM}
        handleSubmit={handleSubmit}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Submit test button' }));

    expect(screen.getByText('There is a problem').outerHTML).toEqual('<h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>');
    expect(screen.getAllByText('Enter your text input value')).toHaveLength(2);
    // Error summary has the error message as a button and correct class
    expect(screen.getByRole('button', { name: 'Enter your text input value' }).outerHTML).toEqual('<button class="govuk-button--text">Enter your text input value</button>');
    // Input field has the error class attached
    expect(screen.getByRole('textbox', { name: 'Text input' }).outerHTML).toEqual('<input class="govuk-input govuk-input--error" id="testField-input" name="testField" type="text" aria-describedby="testField-hint" value="">');
  });

  it('should render error summary & field error for a conditional field if there are field errors', async () => {
    const user = userEvent.setup();
    render(
      <DisplayForm
        formId="testForm"
        fields={formRequiredConditionalTextInput}
        formActions={formActionsSubmitOnly}
        formType={SINGLE_PAGE_FORM}
        handleSubmit={handleSubmit}
      />
    );

    await user.click(screen.getByRole('radio', { name: 'Cat' }));
    await user.click(screen.getByRole('button', { name: 'Submit test button' }));

    expect(screen.getByText('There is a problem').outerHTML).toEqual('<h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>');
    expect(screen.getAllByText('Enter a breed of cat')).toHaveLength(2);
    // // Error summary has the error message as a button and correct class
    expect(screen.getByRole('button', { name: 'Enter a breed of cat' }).outerHTML).toEqual('<button class="govuk-button--text">Enter a breed of cat</button>');
    // // Input field has the error class attached
    expect(screen.getByTestId('breedOfCat-container').outerHTML).toEqual('<div data-testid="breedOfCat-container" class="govuk-radios__conditional"><div class="govuk-form-group govuk-form-group--error"><label class="govuk-label" for="breedOfCat-input">Breed of cat</label><div id="breedOfCat-hint" class="govuk-hint"></div><p id="breedOfCat-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Enter a breed of cat</p><input class="govuk-input govuk-!-width-one-third govuk-input--error" id="breedOfCat-input" name="breedOfCat" type="text" value=""></div></div>');
  });

  it('should return an error if a minimum character count is not met', async () => {
    const user = userEvent.setup();
    render(
      <DisplayForm
        formId="testForm"
        fields={formMinimumLengthTextInput}
        formActions={formActionsSubmitOnly}
        formType={SINGLE_PAGE_FORM}
        handleSubmit={handleSubmit}
      />
    );
    await user.type(screen.getByLabelText('Text input'), 'Ab');
    await user.click(screen.getByRole('button', { name: 'Submit test button' }));

    expect(screen.getByText('There is a problem').outerHTML).toEqual('<h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>');
    expect(screen.getAllByText('Field must be a minimum of 8 characters')).toHaveLength(2);
    // Error summary has the error message as a button and correct class
    expect(screen.getByRole('button', { name: 'Field must be a minimum of 8 characters' }).outerHTML).toEqual('<button class="govuk-button--text">Field must be a minimum of 8 characters</button>');
    // Input field has the error class attached
    expect(screen.getByRole('textbox', { name: 'Text input' }).outerHTML).toEqual('<input class="govuk-input govuk-input--error" id="testField-input" name="testField" type="text" value="">');
  });

  it('should return the error for the first failing validation rule if there are multiple rules', async () => {
    const user = userEvent.setup();
    render(
      <DisplayForm
        formId="testForm"
        fields={formMultipleValidationRules}
        formActions={formActionsSubmitOnly}
        formType={SINGLE_PAGE_FORM}
        handleSubmit={handleSubmit}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Submit test button' }));

    expect(screen.getByText('There is a problem').outerHTML).toEqual('<h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>');
    expect(screen.getAllByText('Enter your text input value')).toHaveLength(2);
    // Error summary has the error message as a button and correct class
    expect(screen.getByRole('button', { name: 'Enter your text input value' }).outerHTML).toEqual('<button class="govuk-button--text">Enter your text input value</button>');
    // Input field has the error class attached
    expect(screen.getByRole('textbox', { name: 'Text input' }).outerHTML).toEqual('<input class="govuk-input govuk-input--error" id="testField-input" name="testField" type="text" value="">');
  });

  it('should scroll to erroring field if user clicks an error summary link for a single input field', async () => {
    const user = userEvent.setup();
    render(
      <DisplayForm
        formId="testForm"
        fields={formRequiredTextInput}
        formActions={formActionsSubmitOnly}
        formType={SINGLE_PAGE_FORM}
        handleSubmit={handleSubmit}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Submit test button' }));
    await user.click(screen.getByRole('button', { name: 'Enter your text input value' }));
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getByRole('textbox', { name: /Text input/i })).toHaveFocus();
  });

  it('should scroll to erroring field if user clicks an error summary link for a radio button set', async () => {
    const user = userEvent.setup();
    render(
      <DisplayForm
        formId="testForm"
        fields={formRequiredRadioInput}
        formActions={formActionsSubmitOnly}
        formType={SINGLE_PAGE_FORM}
        handleSubmit={handleSubmit}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Submit test button' }));
    await user.click(screen.getByRole('button', { name: 'Select your radio option' }));
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getByRole('radio', { name: /Radio one/i })).toHaveFocus();
  });

  it('should clear the error message when user interacts with the field', async () => {
    // the setErrors function should clear the error message from the field when it is called from this scenario
    // we will test that it does clear in Cypress tests
    const user = userEvent.setup();
    render(
      <DisplayForm
        formId="testForm"
        fields={formRequiredTextInput}
        formActions={formActionsSubmitOnly}
        formType={SINGLE_PAGE_FORM}
        handleSubmit={handleSubmit}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Submit test button' }));
    // Input field has the error class attached as component rendered with errors > 0
    expect(screen.getByRole('textbox', { name: 'Text input' }).outerHTML).toEqual('<input class="govuk-input govuk-input--error" id="testField-input" name="testField" type="text" aria-describedby="testField-hint" value="">');
    // user starts to type
    await user.type(screen.getByRole('textbox', { name: 'Text input' }), 'Hello');
    // error class and message is cleared
    expect(screen.getByRole('textbox', { name: 'Text input' }).outerHTML).toEqual('<input class="govuk-input" id="testField-input" name="testField" type="text" aria-describedby="testField-hint" value="">');
    
  });

  // PREFILLING DATA
  it('should store form data in the session for use on refresh', async () => {
    const user = userEvent.setup();
    const expectedStoredData = '{"testField":"Hello","radioButtonSet":"radioTwo","radioWithConditional":"optionWithConditional","conditionalTextInput":"world"}';
    render(
      <DisplayForm
        formId="testForm"
        fields={formWithMultipleFields}
        formActions={formActionsSubmitOnly}
        formType={SINGLE_PAGE_FORM}
        handleSubmit={handleSubmit}
      />
    );
    await user.type(screen.getByLabelText('Text input'), 'Hello');
    expect(screen.getByLabelText('Text input')).toHaveValue('Hello');
    await user.click(screen.getByRole('radio', { name: 'Radio two' }));
    expect(screen.getByRole('radio', { name: 'Radio two' })).toBeChecked();
    await user.click(screen.getByRole('radio', { name: 'Option that has a conditional' }));
    expect(screen.getByRole('radio', { name: 'Option that has a conditional' })).toBeChecked();
    await user.type(screen.getByLabelText('Conditional text input'), 'world');
    expect(screen.getByLabelText('Conditional text input')).toHaveValue('world');
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(expectedStoredData);
  });

  it('should NOT store form data for a password field in the session for use on refresh', async () => {
    const user = userEvent.setup();
    const expectedStoredData = '{"radioButtonSet":"radioTwo"}';
    render(
      <DisplayForm
        formId="testForm"
        fields={formWithMultipleFields}
        formActions={formActionsSubmitOnly}
        formType={SINGLE_PAGE_FORM}
        handleSubmit={handleSubmit}
      />
    );
    await user.type(screen.getByLabelText('Password'), 'MyPassword');
    expect(screen.getByLabelText('Password')).toHaveValue('MyPassword');
    await user.click(screen.getByRole('radio', { name: 'Radio two' }));
    expect(screen.getByRole('radio', { name: 'Radio two' })).toBeChecked();
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(expectedStoredData);
  });

  it('should prefill form with data from session if it exists', async () => {
    const expectedStoredData = '{"testField":"Hello Test Field","radioButtonSet":"radioOne","radioWithConditional":"optionWithConditional","conditionalTextInput":"world"}';
    window.sessionStorage.setItem('formData', JSON.stringify({ testField: 'Hello Test Field', radioButtonSet: 'radioOne', radioWithConditional: 'optionWithConditional', conditionalTextInput: 'world' }));
    render(
      <DisplayForm
        formId="testForm"
        fields={formWithMultipleFields}
        formActions={formActionsSubmitOnly}
        formType={SINGLE_PAGE_FORM}
        handleSubmit={handleSubmit}
      />
    );
    expect(screen.getByLabelText('Text input')).toHaveValue('Hello Test Field');
    expect(screen.getByRole('radio', { name: 'Radio one' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Option that has a conditional' })).toBeChecked();
    expect(screen.getByLabelText('Conditional text input')).toHaveValue('world');
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(expectedStoredData);
  });

  it('should clear session data when form is ready to submit', async () => {
    const user = userEvent.setup();
    const expectedStoredData = '{"testField":"Hello Test Field","radioButtonSet":"radioOne"}';
    window.sessionStorage.setItem('formData', JSON.stringify({ testField: 'Hello Test Field', radioButtonSet: 'radioOne' }));
    render(
      <DisplayForm
        formId="testForm"
        fields={formWithMultipleFields}
        formActions={formActionsSubmitOnly}
        formType={SINGLE_PAGE_FORM}
        handleSubmit={handleSubmit}
      />
    );
    expect(screen.getByLabelText('Text input')).toHaveValue('Hello Test Field');
    expect(screen.getByRole('radio', { name: 'Radio one' })).toBeChecked();
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(expectedStoredData);

    await user.click(screen.getByRole('button', { name: 'Submit test button' }));
    expect(handleSubmit).toHaveBeenCalled();
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(null);
  });
});
