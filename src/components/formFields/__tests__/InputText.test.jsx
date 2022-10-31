import { render, screen } from '@testing-library/react';
import InputText from '../InputText';

/*
 * These tests check that we can pass in the minimum parameters and it will generate the correct input field HTML
 * And we can pass in the maximum parameters and it will generate the correct input field HTML
 * It does NOT test that the full form field component with labels etc is generated
 */

describe('Text input field generation', () => {
  const parentHandleChange = jest.fn();
  const fieldDetailsBasic = {
    fieldName: 'simpleFieldName'
  };
  const fieldDetailsAllProps = {
    fieldName: 'fullFieldName',
    value: 'The full field value',
    hint: 'The hint text',
  };

  it('should render the text input field with only the required props', () => {
    render(
      <InputText
        fieldDetails={fieldDetailsBasic}
        handleChange={parentHandleChange}
        type='text'
      />
    );
    expect(screen.getByRole('textbox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '' }).outerHTML).toEqual('<input class="govuk-input" id="simpleFieldName-input" name="simpleFieldName" type="text">');
  });

  it('should render a text input field with all props passed', () => {
    render(
      <InputText
        autoComplete='email'
        dataTestid='test-id'
        error='this field has an error'
        fieldDetails={fieldDetailsAllProps}
        handleChange={parentHandleChange}
        type='text'
      />
    );
    expect(screen.getByRole('textbox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '' }).outerHTML).toEqual('<input class="govuk-input govuk-input--error" id="fullFieldName-input" data-testid="test-id" name="fullFieldName" type="text" autocomplete="email" aria-describedby="fullFieldName-hint">');
  });
});
