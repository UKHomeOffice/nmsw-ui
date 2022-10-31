import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import FormConfirmationPage from './FormConfirmationPage';

const mockUseLocationState = { state: {} };
const mockedUsedNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUsedNavigate,
  useLocation: jest.fn().mockImplementation(() => {
    return mockUseLocationState;
  })
}));

describe('Form confirmation page', () => {
  it('should render the confirmation page if state exists', () => {
    mockUseLocationState.state = {
      formName: 'Your form name',
      nextPageLink: '/next-page',
      referenceNumber: '123'
    };
    render(<MemoryRouter><FormConfirmationPage /></MemoryRouter>);
    expect(screen.getByText('Your form name submitted')).toBeInTheDocument();
  });

  it('should show an error message if the page loads without form submitted details', () => {
    mockUseLocationState.state = '';
    render(<MemoryRouter><FormConfirmationPage /></MemoryRouter>);
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong, check your form submissions and try again')).toBeInTheDocument();
    expect((screen.getByText('There is a problem')).outerHTML).toEqual('<h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>');
  });

  it('should show an error message if the page loads with an empty object of form submitted details', () => {
    mockUseLocationState.state = {};
    render(<MemoryRouter><FormConfirmationPage /></MemoryRouter>);
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong, check your form submissions and try again')).toBeInTheDocument();
    expect((screen.getByText('There is a problem')).outerHTML).toEqual('<h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>');
  });

  it('should show a reference number if one is provided', () => {
    mockUseLocationState.state = {
      formName: 'Your form name',
      nextPageLink: '/next-page',
      referenceNumber: '123'
    };
    render(<MemoryRouter><FormConfirmationPage /></MemoryRouter>);
    expect(screen.getByText('Your reference number')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('should NOT show reference number text if NO reference number is provided', () => {
    mockUseLocationState.state = {
      formName: 'Your form name',
      nextPageLink: '/next-page',
    };
    render(<MemoryRouter><FormConfirmationPage /></MemoryRouter>);
    expect(screen.queryByText('Your reference number')).not.toBeInTheDocument();
    expect(screen.queryByText('123')).not.toBeInTheDocument();
  });

  it('should state the form name that was submitted', () => {
    mockUseLocationState.state = {
      formName: 'Your form name',
      nextPageLink: '/next-page',
      referenceNumber: '123'
    };
    render(<MemoryRouter><FormConfirmationPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Your form name submitted' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Your form name submitted' }).outerHTML).toEqual('<h1 class="govuk-panel__title">Your form name submitted</h1>');
  });

  it('should have a what happens next section', () => {
    mockUseLocationState.state = {
      formName: 'Your form name',
      nextPageLink: '/next-page',
      referenceNumber: '123'
    };
    render(<MemoryRouter><FormConfirmationPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'What happens next' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'What happens next' }).outerHTML).toEqual('<h2 class="govuk-heading-m">What happens next</h2>');
  });

  it('should have a secondary button to take you to the page specified', async () => {
    mockUseLocationState.state = {
      formName: 'Your form name',
      nextPageLink: '/next-page',
      nextPageName: 'next page',
      referenceNumber: '123'
    };
    const user = userEvent.setup();

    render(<MemoryRouter><FormConfirmationPage /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'Continue to next page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue to next page' }).outerHTML).toEqual('<button class="govuk-button govuk-button--secondary" data-module="govuk-button" type="button">Continue to next page</button>');
    await user.click(screen.getByRole('button', { name: 'Continue to next page' }));
    expect(mockedUsedNavigate).toHaveBeenCalled();
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/next-page');
  });
});
