import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SERVICE_NAME } from '../../constants/AppConstants';
import Landing from './Landing';

describe('Landing page tests', () => {

  it('should render the page with the service name as a H1', async () => {
    render(<MemoryRouter><Landing /></MemoryRouter>);
      expect(screen.getByText('National Maritime Single Window')).toBeInTheDocument();
  });

  it('should render the service name text from the constants file', async () => {
    render(<MemoryRouter><Landing /></MemoryRouter>);
    expect(screen.getByText(SERVICE_NAME)).toBeInTheDocument();
  });

  it('should tell the user what the service is used for', async () => {
    render(<MemoryRouter><Landing /></MemoryRouter>);
    expect(screen.getByText('Use this service to:')).toBeInTheDocument();
  });

  it('should include a link to create an account', async () => {
    render(<MemoryRouter><Landing /></MemoryRouter>);
    expect(screen.getByTestId('createAccountParagraph').outerHTML).toEqual('<p class="govuk-body" data-testid="createAccountParagraph">You\'ll also need to sign in or <a href="/create-account/email-address">create an account</a> to use this service</p>');
  });

  it('should should have a start now button that includes the > and links to the sign-in page', async () => {
    render(<MemoryRouter><Landing /></MemoryRouter>);
    const checkStartNowButton = screen.getByRole('button');
    expect(checkStartNowButton).toBeInTheDocument();
    expect(checkStartNowButton.outerHTML).toEqual('<a role="button" draggable="false" class="govuk-button govuk-button--start" data-module="govuk-button" href="/sign-in">Start now<svg class="govuk-button__start-icon" xmlns="http://www.w3.org/2000/svg" width="17.5" height="19" viewBox="0 0 33 40" aria-hidden="true" focusable="false"><path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z"></path></svg></a>');
  });

});
