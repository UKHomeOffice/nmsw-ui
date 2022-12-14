import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ERROR_URL, REGISTER_EMAIL, REGISTER_EMAIL_VERIFIED } from '../../../constants/AppUrlConstants';
import RegisterEmailAddress from '../RegisterEmailAddress';

const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

let mockedUserPostData = {};
jest.mock('../../../hooks/usePostData', () => {
  return jest.fn(() => (mockedUserPostData));
});

describe('Register email address POST tests', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
  });

  it('should render h1', () => {
    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    expect(screen.getByText('What is your email address')).toBeInTheDocument();
  });

  it('should navigate to register details page if successful POST response', async () => {
    const user = userEvent.setup();
    mockedUserPostData = {
      email: 'jentest202212121535@email.com',
      id: 'e799cd36-9863-495b-9d6d-60132ea5abf5'
    };

    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail@email.com');
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[1], 'testemail@email.com');
    await user.click(screen.getByTestId('submit-button'));

    // mocked usePostData returns a successful response (currently we take success as id received as we don't get the success code yet)
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(REGISTER_EMAIL_VERIFIED);
    });
  });

  it('should NOT navigate to register details page if unsuccessful POST response', async () => {
    const user = userEvent.setup();
    mockedUserPostData = {
      message: 'error response',
      status: '400'
    };

    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail@email.com');
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[1], 'testemail@email.com');
    await user.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(ERROR_URL, {'state': {'redirectURL': REGISTER_EMAIL}}); // on error we redirect to error page
    });
  });

  it('should NOT navigate to register details page if id missing from POST response', async () => {
    const user = userEvent.setup();
    mockedUserPostData = {
      email: 'jentest202212121535@email.com',
    };

    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail@email.com');
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[1], 'testemail@email.com');
    await user.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(ERROR_URL, {'state': {'redirectURL': REGISTER_EMAIL}}); // on error we redirect to error page
    });
  });
});
