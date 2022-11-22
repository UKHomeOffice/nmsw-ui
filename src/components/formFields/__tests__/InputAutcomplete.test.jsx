import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputAutocomplete from '../InputAutocomplete';

/*
 * These tests check that we can pass in the minimum parameters and it will generate the correct input field HTML
 * And we can pass in the maximum parameters and it will generate the correct input field HTML
 * It does NOT test that the full form field component with labels etc is generated
 */

describe('Text input field generation', () => {
  const parentHandleChange = jest.fn();
  const fieldDetailsBasic = {
    // dataAPIEndpoint: 'theEndpointUrl' // when we implement the endpoint
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
    fieldName: 'fullFieldName',
    responseKey: 'name',
  };
  const fieldDetailsAllProps = {
    // dataAPIEndpoint: 'theEndpointUrl' // when we implement the endpoint
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
    fieldName: 'fullFieldName',
    hint: 'The hint text',
    responseKey: 'name',
    additionalKey: 'identifier',
    value: 'ObjectThree',
  };
  const fieldDetailsOneResponseKey = {
    // dataAPIEndpoint: 'theEndpointUrl' // when we implement the endpoint
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
    fieldName: 'fullFieldName',
    responseKey: 'name',
  };
  const fieldDetailsTwoResponseKeys = {
    // dataAPIEndpoint: 'theEndpointUrl' // when we implement the endpoint
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
    fieldName: 'fullFieldName',
    responseKey: 'name',
    additionalKey: 'identifier'
  };

  it('should render the autocomplete input field  with only the required props', () => {
    render(
      <InputAutocomplete
        fieldDetails={fieldDetailsBasic}
        handleChange={parentHandleChange}
      />
    );
    expect(screen.getByRole('combobox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('listbox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: '' }).outerHTML).toEqual('<input aria-expanded="false" aria-activedescendant="false" aria-owns="fullFieldName-input__listbox" aria-autocomplete="list" aria-describedby="fullFieldName-input__assistiveHint" autocomplete="off" class="autocomplete__input autocomplete__input--default" id="fullFieldName-input" name="fullFieldName" placeholder="" type="text" role="combobox" value="">');
    expect(screen.getByRole('listbox', { name: '' }).outerHTML).toEqual('<ul class="autocomplete__menu autocomplete__menu--inline autocomplete__menu--hidden" id="fullFieldName-input__listbox" role="listbox"></ul>');
  });

  it('should render the autocomplete input field with all props passed', () => {
    render(
      <InputAutocomplete
        fieldDetails={fieldDetailsAllProps}
        handleChange={parentHandleChange}
      />
    );
    expect(screen.getByRole('combobox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('listbox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: '' }).outerHTML).toEqual('<input aria-expanded="false" aria-activedescendant="false" aria-owns="fullFieldName-input__listbox" aria-autocomplete="list" aria-describedby="fullFieldName-input__assistiveHint" autocomplete="off" class="autocomplete__input autocomplete__input--default" id="fullFieldName-input" name="fullFieldName" placeholder="" type="text" role="combobox" value="">');
    expect(screen.getByRole('listbox', { name: '' }).outerHTML).toEqual('<ul class="autocomplete__menu autocomplete__menu--inline autocomplete__menu--hidden" id="fullFieldName-input__listbox" role="listbox"></ul>');
  });
  
  it('should render the list options based on what the user enters', async () => {
    const user = userEvent.setup();
    render(
      <InputAutocomplete
        fieldDetails={fieldDetailsOneResponseKey}
        handleChange={parentHandleChange}
      />
    );
    expect(screen.getByRole('combobox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('listbox', { name: '' })).toBeInTheDocument();

    await user.type(screen.getByRole('combobox', { name: '' }), 'Obje');
    expect(screen.getByRole('combobox', { name: '' })).toHaveValue('Obje');
    expect(screen.getByText('ObjectOne')).toBeInTheDocument();
    expect(screen.getByText('ObjectTwo')).toBeInTheDocument();
    expect(screen.getByText('ObjectThree')).toBeInTheDocument();
  });

  it('should return the concatenated value when the field has two response keys', async () => {
    const user = userEvent.setup();
    render(
      <InputAutocomplete
        fieldDetails={fieldDetailsTwoResponseKeys}
        handleChange={parentHandleChange}
      />
    );
    expect(screen.getByRole('combobox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('listbox', { name: '' })).toBeInTheDocument();

    await user.type(screen.getByRole('combobox', { name: '' }), 'Object');
    expect(screen.getByText('ObjectOne one')).toBeInTheDocument();
    expect(screen.getByText('ObjectTwo two')).toBeInTheDocument();
    expect(screen.getByText('ObjectThree three')).toBeInTheDocument();
  });

  it('should update the value of the input if a selection is made from the list', async () => {
    const user = userEvent.setup();
    render(
      <InputAutocomplete
        fieldDetails={fieldDetailsTwoResponseKeys}
        handleChange={parentHandleChange}
      />
    );
    expect(screen.getByRole('combobox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('listbox', { name: '' })).toBeInTheDocument();

    await user.type(screen.getByRole('combobox', { name: '' }), 'Object');
    await user.click(screen.getByText('ObjectTwo two'));
    expect(screen.getByRole('combobox', { name: '' })).toHaveValue('ObjectTwo two');
  });

  // TODO: when the autocomplete defaultValue issue is fixed, update the test here to test it is passed in correctly
  // it('should render the default value in the autocomplete input field when one is provided', async () => {
  //   await waitFor(() => {
  //     render(
  //       <InputAutocomplete
  //         fieldDetails={fieldDetailsAllProps}
  //         handleChange={parentHandleChange}
  //       />
  //     );
  //   });
  //   expect(screen.getByRole('combobox', { name: '' })).toBeInTheDocument();
  //   expect(screen.getByRole('listbox', { name: '' })).toBeInTheDocument();
  //   await waitFor(() => { expect(screen.getByRole('combobox')).toHaveValue('ObjectThree'); });
  // });

});
