import { render, screen } from '@testing-library/react';
import InputRadio from '../InputRadio';

/*
 * These tests check that we can pass in the minimum parameters and it will generate the correct input field HTML
 * And we can pass in the maximum parameters and it will generate the correct input field HTML
 * It does NOT test that the full form field component with labels etc is generated
 */

describe('Radio input field generation', () => {
  const parentHandleChange = jest.fn();
  const fieldDetailsBasic = {
    fieldName: 'simpleFieldName',
    grouped: true,
    label: 'Basic props field radio label',
    radioOptions: [
      {
        label: 'Radio option one label',
        name: 'simpleFieldName',
        id: 'radioOptionOneLabel',
        value: 'radioOptionOneLabel'
      }
    ],
    type: 'radio'
  };
  const fieldDetailsAllProps = {
    className: 'govuk-radios govuk-radios--inline',
    fieldName: 'fullFieldName',
    grouped: true,
    label: 'Full props field radio label',
    hint: 'The hint text',
    value: 'radioOne',
    radioOptions: [
      {
        label: 'Radio option one label',
        name: 'fullFieldName',
        id: 'radioOptionOneLabel',
        value: 'radioOptionOneLabel',
        checked: false
      },
      {
        label: 'Radio option two label',
        name: 'fullFieldName',
        id: 'radioOptionTwoLabel',
        value: 'radioOptionTwoLabel',
        checked: true
      }
    ],
    type: 'radio'
  };

  it('should render the radio input field with only the required props', () => {
    render(
      <InputRadio
        fieldDetails={fieldDetailsBasic}
        handleChange={parentHandleChange}
        type='radio'
      />
    );
    expect(screen.getByRole('radio', { name: 'Radio option one label' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Radio option one label' }).outerHTML).toEqual('<input class="govuk-radios__input" id="simpleFieldName-input[0]" name="simpleFieldName" type="radio" value="radioOptionOneLabel">');
  });

  it('should render the radio input field with all props passed', () => {
    render(
      <InputRadio
        fieldDetails={fieldDetailsAllProps}
        handleChange={parentHandleChange}
        type='radio'
      />
    );
    expect(screen.getByRole('radio', { name: 'Radio option one label' }).outerHTML).toEqual('<input class="govuk-radios__input" id="fullFieldName-input[0]" name="fullFieldName" type="radio" value="radioOptionOneLabel">');
    expect(screen.getByRole('radio', { name: 'Radio option two label' }).outerHTML).toEqual('<input class="govuk-radios__input" id="fullFieldName-input[1]" name="fullFieldName" type="radio" value="radioOptionTwoLabel" checked="">');
    expect(screen.getByRole('radio', { name: 'Radio option one label' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Radio option two label' })).toBeChecked();
  });
});
