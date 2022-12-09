import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RegisterEmailAddres from '../RegisterEmailAddress';

describe('Register email address tests', () => {
  const handleSubmit = jest.fn();
  let scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('should render h1', async () => {
    render(<MemoryRouter><RegisterEmailAddres /></MemoryRouter>);
    expect(screen.getByText('What is your email address')).toBeInTheDocument();
  });

  it('should render an intro inset', async () => {
    render(<MemoryRouter><RegisterEmailAddres /></MemoryRouter>);
    expect(screen.getByText('This will only be used if you need to recover your sign in details.')).toBeInTheDocument();
    expect(screen.getByText('To confirm it is your email address we will send you a verification link.')).toBeInTheDocument();
  });

  it('should render two email address fields', async () => {
    render(<MemoryRouter><RegisterEmailAddres /></MemoryRouter>);
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getAllByRole('textbox', {name: /email/i})[0].outerHTML).toEqual('<input class="govuk-input" id="emailAddress-input" name="emailAddress" type="email" autocomplete="email" value="">');
    expect(screen.getByLabelText('Confirm email address')).toBeInTheDocument();
    expect(screen.getAllByRole('textbox', {name: /email/i})[1].outerHTML).toEqual('<input class="govuk-input" id="repeatEmailAddress-input" name="repeatEmailAddress" type="email" autocomplete="email" value="">');
  });

  it('should display a primary styled continue button', () => {
    render(<MemoryRouter><RegisterEmailAddres /></MemoryRouter>);
    expect((screen.getByTestId('submit-button')).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Continue</button>');
  });

  it('should NOT call the handleSubmit function on button click if there ARE errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddres /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should display the Error Summary if there are errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddres /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
  });

  it('should display the email required error if there is no email address', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddres /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getAllByText('Enter an email address in the correct format, like name@example.com')).toHaveLength(2);
  });

  it('should scroll to email field and set focus on email input if user clicks on email required error link', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddres /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    await user.click(screen.getByRole('button', { name: 'Enter an email address in the correct format, like name@example.com'}));
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getAllByRole('textbox', {name: /email/i})[0]).toHaveFocus();
  });

  it('should display the email invalid error if the email address has no @', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddres /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', {name: /email/i})[0], 'testemail');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getAllByText('Enter an email address in the correct format, like name@example.com')).toHaveLength(2);
  });

  it('should display the email invalid error if the email address has no .xx', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddres /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', {name: /email/i})[0], 'testemail@boo');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getAllByText('Enter an email address in the correct format, like name@example.com')).toHaveLength(2);
  });

  it('should scroll to email field and set focus on email input if user clicks on email invalid format error link', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddres /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', {name: /email/i})[0], 'testemail@boo');
    await user.click(screen.getByTestId('submit-button'));
    await user.click(screen.getByRole('button', { name: 'Enter an email address in the correct format, like name@example.com'}));
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getAllByRole('textbox', {name: /email/i})[0]).toHaveFocus();
  });

  it('should display the emails must match error if the repeat email field value is null', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddres /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', {name: /email/i})[0], 'testemail@boo.com');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getAllByText('Confirm your email address')).toHaveLength(2);
  });

  it('should scroll to repeat email field and set focus on repeat email input if user clicks on repeat email required link', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddres /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', {name: /email/i})[0], 'testemail@boo.com');
    await user.click(screen.getByTestId('submit-button'));
    await user.click(screen.getByRole('button', { name: 'Confirm your email address'}));
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getAllByRole('textbox', {name: /email/i})[1]).toHaveFocus();
  });

  it('should display the emails must match error if the repeat email field value does not match the email value', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddres /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', {name: /email/i})[0], 'testemail@boo.com');
    await user.type(screen.getAllByRole('textbox', {name: /email/i})[1], 'testemail@boo');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getAllByText('Your email addresses must match')).toHaveLength(2);
  });

  it('should scroll to repeat email field and set focus on repeat email input if user clicks on emails dont match error link', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddres /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', {name: /email/i})[0], 'testemail@boo.com');
    await user.type(screen.getAllByRole('textbox', {name: /email/i})[1], 'testemail@boo');
    await user.click(screen.getByTestId('submit-button'));
    await user.click(screen.getByRole('button', { name: 'Your email addresses must match'}));
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getAllByRole('textbox', {name: /email/i})[1]).toHaveFocus();
  });

  it('should NOT display the email errors if the email address is a valid format & emails match', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddres /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', {name: /email/i})[0], 'testemail@email.com');
    await user.type(screen.getAllByRole('textbox', {name: /email/i})[1], 'testemail@email.com');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.queryByText('Enter your email address')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter your email address in the correct format, like name@example.com')).not.toBeInTheDocument();
    expect(screen.queryByText('Confirm your email address')).not.toBeInTheDocument();
    expect(screen.queryByText('Your email addresses must match')).not.toBeInTheDocument();
  });

});
