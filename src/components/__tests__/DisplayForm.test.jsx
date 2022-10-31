import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DisplayForm from '../DisplayForm';
import {
  FIELD_EMAIL,
  FIELD_PASSWORD,
  FIELD_RADIO,
  FIELD_TEXT,
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
  const formTextInput = [
    {
      type: FIELD_TEXT,
      label: 'Text input',
      hint: 'This is a hint for a text input',
      fieldName: 'testField',
    }
  ];
  const formRadioInput = [
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
      ]
    },
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
    },
    {
      type: FIELD_PASSWORD,
      label: 'Password input',
      hint: 'This is a hint for a password input',
      fieldName: 'password',
    }
  ];
  const formTextInputWithErrors = [
    {
      name: 'testField',
      message: 'testField is erroring'
    }
  ];
  const formRadioInputWithErrors = [
    {
      name: 'radioButtonSet',
      message: 'radioButtonSet is erroring'
    }
  ];

  it('should render a submit and cancel button if both exist', () => {
    render(
      <DisplayForm
        formId="testForm"
        fields={formTextInput}
        formActions={formActions}
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
        fields={formTextInput}
        formActions={formActionsSubmitOnly}
        handleSubmit={handleSubmit}
      />
    );
    expect(screen.getByTestId('submit-button').outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Submit test button</button>');
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('should render a text input', () => {
    render(
      <DisplayForm
        formId="testForm"
        fields={formTextInput}
        formActions={formActionsSubmitOnly}
        handleSubmit={handleSubmit}
      />
    );
    expect(screen.getByLabelText('Text input')).toBeInTheDocument();
    expect(screen.getByText('This is a hint for a text input').outerHTML).toEqual('<div id="testField-hint" class="govuk-hint">This is a hint for a text input</div>');
    expect(screen.getByRole('textbox', { name: 'Text input' })).toBeInTheDocument();
  });

  it('should render a radio button input', () => {
    render(
      <DisplayForm
        formId="testForm"
        fields={formRadioInput}
        formActions={formActionsSubmitOnly}
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

  it('should render the special input types', () => {
    render(
      <DisplayForm
        formId="testForm"
        fields={formSpecialInputs}
        formActions={formActionsSubmitOnly}
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

  it('should render error summary & field error if there are field errors', async () => {
    render(
      <DisplayForm
        errors={formTextInputWithErrors}
        formId="testForm"
        fields={formTextInput}
        formActions={formActionsSubmitOnly}
        handleSubmit={handleSubmit}
      />
    );

    expect(screen.getByText('There is a problem').outerHTML).toEqual('<h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>');
    expect(screen.getAllByText('testField is erroring')).toHaveLength(2);
    // Error summary has the error message as a button and correct class
    expect(screen.getByRole('button', { name: 'testField is erroring'}).outerHTML).toEqual('<button class="govuk-button--text">testField is erroring</button>');
    // Input field has the error class attached
    expect(screen.getByRole('textbox', { name: 'Text input' }).outerHTML).toEqual('<input class="govuk-input govuk-input--error" id="testField-input" name="testField" type="text" aria-describedby="testField-hint">');
  });

  it('should scroll to erroring field if user clicks an error summary link for a single input field', async () => {
    const user = userEvent.setup();
    render(
      <DisplayForm
        errors={formTextInputWithErrors}
        formId="testForm"
        fields={formTextInput}
        formActions={formActionsSubmitOnly}
        handleSubmit={handleSubmit}
      />
    );

    await user.click(screen.getByRole('button', { name: 'testField is erroring'}));
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getByRole('textbox', {name: /Text input/i})).toHaveFocus();
  });

  it('should scroll to erroring field if user clicks an error summary link for a radio button set', async () => {
    const user = userEvent.setup();
    render(
      <DisplayForm
        errors={formRadioInputWithErrors}
        formId="testForm"
        fields={formRadioInput}
        formActions={formActionsSubmitOnly}
        handleSubmit={handleSubmit}
      />
    );

    await user.click(screen.getByRole('button', { name: 'radioButtonSet is erroring'}));
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getByRole('radio', {name: /Radio one/i})).toHaveFocus();
  });
});
