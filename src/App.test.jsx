import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { SERVICE_NAME } from './constants/AppConstants.js';
import App from './App.jsx';

describe('App tests', () => {
  it('should render the heading on the page', async () => {
    render(<BrowserRouter><App /></BrowserRouter>);
    expect(screen.getByText('GOV.UK')).toBeInTheDocument();
    expect(screen.getByTestId('serviceName').textContent).toEqual(SERVICE_NAME);
  });

  it('should render the phase banner on the page', async () => {
    render(<BrowserRouter><App /></BrowserRouter>);
    expect(screen.getByTestId('phaseBannerText')).toHaveTextContent('This is a new service - your feedback will help us to improve it.');
  });

  it('should render the footer on the page', async () => {
    render(<BrowserRouter><App /></BrowserRouter>);
    expect(screen.getByText('© Crown copyright')).toBeInTheDocument();
    expect(screen.getByText('© Crown copyright').outerHTML).toEqual('<a class="govuk-footer__link govuk-footer__copyright-logo" target="_blank" rel="noreferrer noopener" href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/">© Crown copyright</a>');
    expect(screen.getByText('Cookies')).toBeInTheDocument();
    expect(screen.getByText('Cookies').outerHTML).toEqual('<a class="govuk-footer__link" href="/cookies">Cookies</a>');
    expect(screen.getByText('Accessibility')).toBeInTheDocument();
    expect(screen.getByText('Accessibility').outerHTML).toEqual('<a class="govuk-footer__link" href="/accessibility-statement">Accessibility</a>');
    expect(screen.getByText('Privacy')).toBeInTheDocument();
    expect(screen.getByText('Privacy').outerHTML).toEqual('<a class="govuk-footer__link" href="/privacy-notice">Privacy</a>');
  });

  it('should render cookie banner when there is no cookiePreference cookie', async () => {
    render(<BrowserRouter><App /></BrowserRouter>);
    const acceptButton = screen.getByRole('button', { name: 'Accept analytics cookies' });
    const rejectButton = screen.getByRole('button', { name: 'Reject analytics cookies' });

    expect(screen.getByText('We use some essential cookies to make this service work.')).toBeInTheDocument();
    expect(screen.getByText('We\'d also like to use analytics cookies so we can understand how you use the service and make improvements.')).toBeInTheDocument();
    expect(acceptButton).toBeInTheDocument();
    expect(rejectButton).toBeInTheDocument();
  });

  it('should hide the cookie confirmation banner once hide cookie message is clicked after user accepts or rejects cookies', async () => {
      const user = userEvent.setup();
      render(<BrowserRouter><App /></BrowserRouter>);
  
      const acceptButton = screen.getByRole('button', { name: 'Accept analytics cookies' });
      await user.click(acceptButton);
  
      const hideButton = screen.getByRole('button', { name: 'Hide cookie message'});
      await user.click(hideButton);
  
      expect(screen.queryByText('We use some essential cookies to make this service work.')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Accept analytics cookies' })).not.toBeInTheDocument();
      expect(screen.queryByTestId('cookieMessage')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Hide cookie message'})).not.toBeInTheDocument();
    });

  it('should not render cookie banner when cookiePreference is true', async () => {
    document.cookie = 'cookiePreference=true';
    render(<BrowserRouter><App /></BrowserRouter>);
    const acceptButton = screen.queryByRole('button', { name: 'Accept analytics cookies' });
    const rejectButton = screen.queryByRole('button', { name: 'Reject analytics cookies' });

    expect(acceptButton).not.toBeInTheDocument();
    expect(rejectButton).not.toBeInTheDocument();
    expect(screen.queryByText('We use some essential cookies to make this service work.')).not.toBeInTheDocument();
    expect(screen.queryByText('We\'d also like to use analytics cookies so we can understand how you use the service and make improvements.')).not.toBeInTheDocument();
  });

  it('should not render cookie banner when cookiePreference is false', async () => {
    document.cookie = 'cookiePreference=false';
    render(<BrowserRouter><App /></BrowserRouter>);
    const acceptButton = screen.queryByRole('button', { name: 'Accept analytics cookies' });
    const rejectButton = screen.queryByRole('button', { name: 'Reject analytics cookies' });

    expect(acceptButton).not.toBeInTheDocument();
    expect(rejectButton).not.toBeInTheDocument();
    expect(screen.queryByText('We use some essential cookies to make this service work.')).not.toBeInTheDocument();
    expect(screen.queryByText('We\'d also like to use analytics cookies so we can understand how you use the service and make improvements.')).not.toBeInTheDocument();
  });
});
