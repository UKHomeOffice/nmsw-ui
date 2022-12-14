import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ERROR_URL, REGISTER_CONFIRMATION, REGISTER_EMAIL_VERIFIED } from '../../../constants/AppUrlConstants';
import RegisterYourPassword from '../RegisterYourPassword';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => {
    return mockUseLocationState;
  })
}));

let mockedUserPatchData = {};
jest.mock('../../../hooks/usePatchData', () => {
  return jest.fn(() => (mockedUserPatchData));
});


describe('Register password tests', () => {
  const handleSubmit = jest.fn();
  let scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

  beforeEach(() => {

    window.sessionStorage.clear();
  });

  it('should render h1', async () => {
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    expect(screen.getByText('Create a password')).toBeInTheDocument();
  });

  it('should render an intro', async () => {
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    expect(screen.getByText('Your password must be at least 10 characters long. There is no restriction on the characters you use.')).toBeInTheDocument();
    /*
     * Because the text below is in a paragraph which has a link within it, RTL struggles to find the text in the render
     * We could test by adding a data-testId
     * but we can also test more easily with the Cypress tests
     * so leaving this line for the Cypress tests
     */
    // expect(screen.getByText('To create a long and strong password, the National Cyber Security Centre recommends using ')).toBeInTheDocument();
    expect(screen.getByText('3 random words')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://www.ncsc.gov.uk/collection/top-tips-for-staying-secure-online/three-random-words#:~:text=Why%20does%20the%20NCSC%20recommend,enough%20for%20you%20to%20remember');
  });

  it('should render two password questions', async () => {
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Password').outerHTML).toEqual('<input class="govuk-input" id="requirePassword-input" data-testid="requirePassword-passwordField" name="requirePassword" type="password" value="">');
    expect(screen.getByLabelText('Confirm your password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm your password').outerHTML).toEqual('<input class="govuk-input" id="repeatPassword-input" data-testid="repeatPassword-passwordField" name="repeatPassword" type="password" value="">');
  });

  it('should render a continue button', async () => {
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'Continue' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Continue</button>');
  });

  it('should NOT call the handleSubmit function on button click if there ARE errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should display the Error Summary if there are errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
  });

  it('should display the required error messages if required fields are null', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Enter a password')).toHaveLength(2);
    expect(screen.getAllByText('Confirm your password')).toHaveLength(3); // label & 2 error messages
  });

  it('should display the required error messages if just confirm password is null', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), 'mypasswordis');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Confirm your password')).toHaveLength(3);
  });

  it('should display the min length error messages if password field too short', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), 'shortpwd');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Passwords must be at least 10 characters long')).toHaveLength(2);
  });

  it('should display the error messages if password fields do not match', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), 'mypasswordis');
    await user.type(screen.getByLabelText('Confirm your password'), 'mypass');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Passwords must match')).toHaveLength(2);
  });

  it('should NOT display error messagess if fields are valid', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), 'mypasswordis');
    await user.type(screen.getByLabelText('Confirm your password'), 'mypasswordis');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.queryByText('There is a problem')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter a password')).not.toBeInTheDocument();
    expect(screen.getAllByText('Confirm your password')).toHaveLength(1); // label only
  });

  it('should persist data from previous form (state.dataToSubmit) in session as well as new fields', async () => {
    const user = userEvent.setup();
    const expectedStoredData = '{"fullName":"Joe Bloggs","companyName":"My company","phoneNumber":"(123)12345","country":"AUS","shippingAgent":"yes","requirePassword":"mypasswordis","repeatPassword":"mypasswordis"}';
    mockUseLocationState.state = {
      dataToSubmit: {
        companyName: 'My company',
        country: 'AUS',
        emailAddress: 'testemail@email.com',
        fullName: 'Joe Bloggs',
        phoneNumber: '(123)12345',
        shippingAgent: 'yes'
      }
    };
    mockedUserPatchData = {
      data: {
        email: 'testemail@email.com',
        fullName: 'Joe Bloggs',
        country: 'AUS',
        phoneNumber: '(123)12345',
        groupName: 'My company',
        groupTypeName: 'Shipping Agency',
        id: '123',
        groupId: '456',
        verified: false,
        dateCreated: '2022-12-14T10:10:17.134835',
        lastUpdated: '2022-12-14T14:20:23.497658'
      }
    };

    // set what would be in the session prior to this page
    window.sessionStorage.setItem('formData', JSON.stringify({ fullName: 'Joe Bloggs', companyName: 'My company', phoneNumber: '(123)12345', country: 'AUS', shippingAgent: 'yes' }));
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), 'mypasswordis');
    await user.type(screen.getByLabelText('Confirm your password'), 'mypasswordis');
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(expectedStoredData);
    // after successful submit session data should clear
    await user.click(screen.getByTestId('submit-button'));
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(null);
  });

  it('should navigate to confirmation page if successful PATCH response', async () => {
    const user = userEvent.setup();
    mockedUserPatchData = {
      data: {
        email: 'testemail@email.com',
        fullName: 'Joe Bloggs',
        country: 'AUS',
        phoneNumber: '(123)12345',
        groupName: 'My company',
        groupTypeName: 'Shipping Agency',
        id: '123',
        groupId: '456',
        verified: false,
        dateCreated: '2022-12-14T10:10:17.134835',
        lastUpdated: '2022-12-14T14:20:23.497658'
      }
    };

    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), 'mypasswordis');
    await user.type(screen.getByLabelText('Confirm your password'), 'mypasswordis');
    await user.click(screen.getByTestId('submit-button'));
    // mocked usePatchData returns a successful response (currently we take success as id received as we don't get the success code yet)
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(REGISTER_CONFIRMATION, { 'state': { 'companyName': 'My company' } });
    });
  });

  it('should navigate to error page if failed PATCH response', async () => {
    const user = userEvent.setup();
    mockedUserPatchData = {
      message: 'error response',
      status: '400'
    };

    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), 'mypasswordis');
    await user.type(screen.getByLabelText('Confirm your password'), 'mypasswordis');
    await user.click(screen.getByTestId('submit-button'));
    // mocked usePatchData returns a successful response (currently we take success as id received as we don't get the success code yet)
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(ERROR_URL, {'state': {'redirectURL': REGISTER_EMAIL_VERIFIED}});
    });
  });

  it('should navigate to error page if id missing from PATCH response', async () => {
    const user = userEvent.setup();
    mockedUserPatchData = {
      data: {
        email: 'testemail@email.com',
        fullName: 'Joe Bloggs',
      }
    };

    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), 'mypasswordis');
    await user.type(screen.getByLabelText('Confirm your password'), 'mypasswordis');
    await user.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(ERROR_URL, {'state': {'redirectURL': REGISTER_EMAIL_VERIFIED}});
    });
  });

});
