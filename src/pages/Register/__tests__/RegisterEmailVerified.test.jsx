import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { REGISTER_DETAILS_URL } from '../../../constants/AppUrlConstants';
import RegisteredEmailVerified from '../RegisterEmailVerified';

const mockedUseNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
}));

describe('Email verified registration page tests', () => {

  it('should render h1', async () => {
    render(<MemoryRouter><RegisteredEmailVerified /></MemoryRouter>);
    expect(screen.getByText('Your email address has been verified​')).toBeInTheDocument();
  });

  it('should render a continue button to take user to your details', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisteredEmailVerified /></MemoryRouter>);
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Enter your email address'), 'testemail@email.com');
    await user.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(REGISTER_DETAILS_URL, { 'state': { 'dataToSubmit': { 'emailAddress': 'testemail@email.com' } } });
    });
  });
});
