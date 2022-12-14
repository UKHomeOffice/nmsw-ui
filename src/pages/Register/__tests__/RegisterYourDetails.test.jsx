import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RegisterYourDetails from '../RegisterYourDetails';

describe('Register your details tests', () => {
  const handleSubmit = jest.fn();
  let scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('should render h1', async () => {
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByText('Your details')).toBeInTheDocument();
  });

  it('should render a full name question', async () => {
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByLabelText('Full name')).toBeInTheDocument();
    expect(screen.getByRole('textbox', {name: 'Full name'}).outerHTML).toEqual('<input class="govuk-input" id="fullName-input" name="fullName" type="text" value="">');
  });

  it('should render a company name question', async () => {
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByLabelText('Your company name')).toBeInTheDocument();
    expect(screen.getByRole('textbox', {name: 'Your company name'}).outerHTML).toEqual('<input class="govuk-input" id="companyName-input" name="companyName" type="text" value="">');
  });

  it('should render a phone number question', async () => {
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByText('Phone number field')).toBeInTheDocument();
    expect(screen.getByLabelText('Country code field')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Country code field' })).toBeInTheDocument();
    expect(screen.getByLabelText('Phone number field')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Phone number field' })).toBeInTheDocument();
  });

  it('should render a country question', async () => {
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByLabelText('Country (3 digit country code)')).toBeInTheDocument();
    expect(screen.getByRole('textbox', {name: 'Country (3 digit country code)'}).outerHTML).toEqual('<input class="govuk-input" id="country-input" name="country" type="text" value="">');
  });

  it('should render a shipping agent question', async () => {
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByText('Is your company a shipping agent?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByRole('group', {name: 'Is your company a shipping agent?'}).outerHTML).toEqual('<fieldset class="govuk-fieldset"><legend class="govuk-fieldset__legend">Is your company a shipping agent?</legend><div id="shippingAgent-hint" class="govuk-hint"></div><p id="shippingAgent-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> </p><div class="govuk-radios govuk-radios--inline" data-module="govuk-radios"><div class="govuk-radios__item"><input class="govuk-radios__input" id="shippingAgent-input[0]" name="shippingAgent" type="radio" value="yes"><label class="govuk-label govuk-radios__label" for="shippingAgent-input[0]">Yes</label></div><div class="govuk-radios__item"><input class="govuk-radios__input" id="shippingAgent-input[1]" name="shippingAgent" type="radio" value="no"><label class="govuk-label govuk-radios__label" for="shippingAgent-input[1]">No</label></div></div></fieldset>');
  });

  it('should render a continue button', async () => {
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByRole('button', {name: 'Continue'}).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Continue</button>');
  });

  it('should NOT call the handleSubmit function on button click if there ARE errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should display the Error Summary if there are errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
  });

  it('should display the required error messages if required fields are null', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Enter your full name')).toHaveLength(2);
    expect(screen.getAllByText('Enter your company name')).toHaveLength(2);
    expect(screen.getAllByText('Enter your phone number')).toHaveLength(2);
    expect(screen.getAllByText('Enter country')).toHaveLength(2);
    expect(screen.getAllByText('Select is your company a shipping agent')).toHaveLength(2);
  });

  it('should display the error messages if fields are formatted incorrectly', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    await user.type(screen.getByLabelText('Country code field'), '123');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Enter your country code and phone number')).toHaveLength(2);
  });

  it('should NOT display error messagess if fields are valid', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    await user.type(screen.getByLabelText('Full name'), 'Joe Bloggs');
    await user.type(screen.getByLabelText('Your company name'), 'Joe Bloggs Company');
    await user.type(screen.getByLabelText('Country code field'), '123');
    await user.type(screen.getByLabelText('Phone number field'), '12345');
    await user.type(screen.getByLabelText('Country (3 digit country code)'), 'AUS');
    await user.click(screen.getByRole('radio', { name: 'Yes' }));
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.queryByText('There is a problem')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter your full name')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter your company name')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter your phone number')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter country')).not.toBeInTheDocument();
    expect(screen.queryByText('Select is your company a shipping agent')).not.toBeInTheDocument();
  });

  it('should NOT clear form session data on submit', async () => {
    const user = userEvent.setup();
    const expectedStoredData = '{"fullName":"Joe Bloggs","companyName":"Joe Bloggs Company","phoneNumber":"(123)12345","country":"AUS","shippingAgent":"yes"}';
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);

    await user.type(screen.getByLabelText('Full name'), 'Joe Bloggs');
    await user.type(screen.getByLabelText('Your company name'), 'Joe Bloggs Company');
    await user.type(screen.getByLabelText('Country code field'), '123');
    await user.type(screen.getByLabelText('Phone number field'), '12345');
    await user.type(screen.getByLabelText('Country (3 digit country code)'), 'AUS');
    await user.click(screen.getByRole('radio', { name: 'Yes' }));

    await user.click(screen.getByTestId('submit-button'));
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(expectedStoredData);
  });
});
