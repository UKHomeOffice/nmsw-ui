import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FIELD_CONDITIONAL } from '../../../constants/AppConstants';
import InputConditional from '../InputConditional';

/*
 * These tests check that we can pass in the minimum parameters and it will generate the correct input field HTML
 * And we can pass in the maximum parameters and it will generate the correct input field HTML
 * It does NOT test that the full form field component with labels etc is generated
 */

describe('Conditional input field generation', () => {
  const parentHandleChange = jest.fn();
  const fieldDetailsBasic = {
    type: FIELD_CONDITIONAL,
    className: 'govuk-radios',
    label: 'What is your favourite animal',
    fieldName: 'favAnimal',
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
  };
  const fieldDetailsAllProps = {
    type: FIELD_CONDITIONAL,
    className: 'govuk-radios',
    hint: 'A hint on choosing a colour',
    label: 'What is your favourite colour',
    fieldName: 'favColour',
    grouped: true,
    radioOptions: [
      {
        radioField: true,
        label: 'Red',
        name: 'favColour',
        value: 'red',
      },
      {
        radioField: false,
        parentFieldValue: 'red',
        hint: 'What shade of red do you like?',
        label: 'Shade of red',
        name: 'shadeOfRed',
      },
      {
        radioField: true,
        label: 'Other',
        name: 'favColour',
        value: 'other',
      },
    ],
  };
  const fieldDetailsWithValueSelected = {
    type: FIELD_CONDITIONAL,
    className: 'govuk-radios',
    hint: 'A hint on choosing a colour',
    label: 'What is your favourite colour',
    fieldName: 'favColour',
    grouped: true,
    radioOptions: [
      {
        radioField: true,
        label: 'Red',
        name: 'favColour',
        value: 'red',
      },
      {
        radioField: false,
        parentFieldValue: 'red',
        hint: 'What shade of red do you like?',
        label: 'Shade of red',
        name: 'shadeOfRed',
      },
      {
        radioField: true,
        label: 'Other',
        name: 'favColour',
        value: 'other',
      },
    ],
    value: 'red',
  };
  
  it('should render the radio input fields with only the required props', () => {
    render(
      <InputConditional
        fieldDetails={fieldDetailsBasic}
        handleChange={parentHandleChange}
      />
    );
    expect(screen.getByRole('radio', { name: 'Cat' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Cat' }).outerHTML).toEqual('<input class="govuk-radios__input" id="favAnimal-input[0]" name="favAnimal" type="radio" value="cat">');
    expect(screen.getByRole('radio', { name: 'Dog' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Dog' }).outerHTML).toEqual('<input class="govuk-radios__input" id="favAnimal-input[2]" name="favAnimal" type="radio" value="dog">');
    expect(screen.getByRole('radio', { name: 'Rabbit' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Rabbit' }).outerHTML).toEqual('<input class="govuk-radios__input" id="favAnimal-input[4]" name="favAnimal" type="radio" value="rabbit">');
    expect(screen.getByRole('radio', { name: 'Other' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Other' }).outerHTML).toEqual('<input class="govuk-radios__input" id="favAnimal-input[5]" name="favAnimal" type="radio" value="other">');
    expect(screen.queryByRole('radio', { name: 'breedOfCat' })).not.toBeInTheDocument(); // tests the text field isn't displayed as radio
    expect(screen.queryByRole('radio', { name: 'breedOfDog' })).not.toBeInTheDocument(); // tests the text field isn't displayed as radio
  });

  it('should render the radio input fields with all props', () => {
    render(
      <InputConditional
        fieldDetails={fieldDetailsAllProps}
        handleChange={parentHandleChange}
      />
    );
    expect(screen.getByRole('radio', { name: 'Red' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Red' }).outerHTML).toEqual('<input class="govuk-radios__input" id="favColour-input[0]" name="favColour" type="radio" value="red">');
    expect(screen.getByRole('radio', { name: 'Other' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Other' }).outerHTML).toEqual('<input class="govuk-radios__input" id="favColour-input[2]" name="favColour" type="radio" value="other">');
  });

  it('should make the conditional text input visible when the parent radio is selected', async () => {
    const user = userEvent.setup();
    render(
      <InputConditional
        fieldDetails={fieldDetailsBasic}
        handleChange={parentHandleChange}
      />
    );
    
    // The following are conditional fields, they will exist but should have a hidden class
    expect(screen.getByTestId('breedOfCat-container')).toBeInTheDocument();
    expect(screen.getByTestId('breedOfCat-container').outerHTML).toEqual('<div data-testid="breedOfCat-container" class="govuk-radios__conditional govuk-radios__conditional--hidden"><div class="govuk-form-group"><label class="govuk-label" for="breedOfCat-input">Breed of cat</label><div id="breedOfCat-hint" class="govuk-hint"></div><p id="breedOfCat-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> </p><input class="govuk-input govuk-!-width-one-third" id="breedOfCat-input" name="breedOfCat" type="text" value=""></div></div>');
    expect(screen.getByTestId('breedOfDog-container')).toBeInTheDocument();
    expect(screen.getByTestId('breedOfDog-container').outerHTML).toEqual('<div data-testid="breedOfDog-container" class="govuk-radios__conditional govuk-radios__conditional--hidden"><div class="govuk-form-group"><label class="govuk-label" for="breedOfDog-input">Breed of dog</label><div id="breedOfDog-hint" class="govuk-hint"></div><p id="breedOfDog-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> </p><input class="govuk-input govuk-!-width-one-third" id="breedOfDog-input" name="breedOfDog" type="text" value=""></div></div>');
    
    // Click on the cat radio and now the Breed of cat should not have the hidden class aka it is visible
    await user.click(screen.getByRole('radio', { name: 'Cat' }));
    expect(screen.getByRole('radio', { name: 'Cat' })).toBeChecked();
    expect(screen.getByTestId('breedOfCat-container').outerHTML).toEqual('<div data-testid="breedOfCat-container" class="govuk-radios__conditional"><div class="govuk-form-group"><label class="govuk-label" for="breedOfCat-input">Breed of cat</label><div id="breedOfCat-hint" class="govuk-hint"></div><p id="breedOfCat-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> </p><input class="govuk-input govuk-!-width-one-third" id="breedOfCat-input" name="breedOfCat" type="text" value=""></div></div>');
  
    // Click on the dog radio and now Breed of cat should be hidden and breed of dog should be visible
    await user.click(screen.getByRole('radio', { name: 'Dog' }));
    expect(screen.getByRole('radio', { name: 'Dog' })).toBeChecked();
    expect(screen.getByTestId('breedOfCat-container').outerHTML).toEqual('<div data-testid="breedOfCat-container" class="govuk-radios__conditional govuk-radios__conditional--hidden"><div class="govuk-form-group"><label class="govuk-label" for="breedOfCat-input">Breed of cat</label><div id="breedOfCat-hint" class="govuk-hint"></div><p id="breedOfCat-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> </p><input class="govuk-input govuk-!-width-one-third" id="breedOfCat-input" name="breedOfCat" type="text" value=""></div></div>');
    expect(screen.getByTestId('breedOfDog-container').outerHTML).toEqual('<div data-testid="breedOfDog-container" class="govuk-radios__conditional"><div class="govuk-form-group"><label class="govuk-label" for="breedOfDog-input">Breed of dog</label><div id="breedOfDog-hint" class="govuk-hint"></div><p id="breedOfDog-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> </p><input class="govuk-input govuk-!-width-one-third" id="breedOfDog-input" name="breedOfDog" type="text" value=""></div></div>');
  });

  it('should clear values of conditional fields if they become hidden', async () => {
    const user = userEvent.setup();
    render(
      <InputConditional
        fieldDetails={fieldDetailsBasic}
        handleChange={parentHandleChange}
      />
    );
    
    await user.click(screen.getByRole('radio', { name: 'Dog' }));
    await user.type(screen.getByRole('radio', { name: 'Dog' }), 'Labrador');
    await user.click(screen.getByRole('radio', { name: 'Rabbit' }));
    // Dog breed should be hidden with no value
    expect(screen.getByTestId('breedOfDog-container').outerHTML).toEqual('<div data-testid="breedOfDog-container" class="govuk-radios__conditional govuk-radios__conditional--hidden"><div class="govuk-form-group"><label class="govuk-label" for="breedOfDog-input">Breed of dog</label><div id="breedOfDog-hint" class="govuk-hint"></div><p id="breedOfDog-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> </p><input class="govuk-input govuk-!-width-one-third" id="breedOfDog-input" name="breedOfDog" type="text" value=""></div></div>');
  });

  it('should render the hint on the conditional text field if one provided', async () => {
    const user = userEvent.setup();
    render(
      <InputConditional
        fieldDetails={fieldDetailsAllProps}
        handleChange={parentHandleChange}
      />
    );
    await user.click(screen.getByRole('radio', { name: 'Red' }));
    // using a text check to test the text is in the html as it should render, but inside a div with a hidden class
    expect(screen.getByText('What shade of red do you like?')).toBeInTheDocument();
    // using a html check to test for the class being visible AND the help text and aria-described by being in the div
    expect(screen.getByTestId('shadeOfRed-container').outerHTML).toEqual('<div data-testid="shadeOfRed-container" class="govuk-radios__conditional"><div class="govuk-form-group"><label class="govuk-label" for="shadeOfRed-input">Shade of red</label><div id="shadeOfRed-hint" class="govuk-hint">What shade of red do you like?</div><p id="shadeOfRed-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> </p><input aria-describedby="shadeOfRed-hint" class="govuk-input govuk-!-width-one-third" id="shadeOfRed-input" name="shadeOfRed" type="text" value=""></div></div>');
  });

  it('should check the field if the value is passed in', () => {
    render(
      <InputConditional
        fieldDetails={fieldDetailsWithValueSelected}
        handleChange={parentHandleChange}
        type='radio'
      />
    );
    expect(screen.getByRole('radio', { name: 'Red' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Other' })).not.toBeChecked();
  });
});
