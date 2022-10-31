import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import CookieBanner from '../CookieBanner';

// For when more than just the cookiePreference cookie exists 
const extractPreferenceCookie = (cookieName) => {
  const cookieArray = document.cookie.split(';');

  for (let i = 0; i < cookieArray.length; i++) {
    let cookiePair = cookieArray[i].split('=');
    if (cookieName == cookiePair[0].trim()) {
      return cookieArray[i];
    }
  }
};

const setIsCookieBannerShown = jest.fn();

describe('CookieBanner tests', () => {

  it('should render the CookieBanner with cookie text', async () => {
    render(<MemoryRouter><CookieBanner setIsCookieBannerShown={setIsCookieBannerShown} /></MemoryRouter>);
    expect(screen.getByText('Cookies on National Maritime Single Window')).toBeInTheDocument();
    expect(screen.getByText('We use some essential cookies to make this service work.')).toBeInTheDocument();
    expect(screen.getByText('We\'d also like to use analytics cookies so we can understand how you use the service and make improvements.')).toBeInTheDocument();
  });

  it('should render an accept and a reject button', async () => {
    render(<MemoryRouter><CookieBanner setIsCookieBannerShown={setIsCookieBannerShown} /></MemoryRouter>);
    const acceptButton = screen.getByRole('button', { name: 'Accept analytics cookies' });
    const rejectButton = screen.getByRole('button', { name: 'Reject analytics cookies' });
    const viewCookieLink = screen.getByRole('link', { name: 'View cookies'});

    expect(acceptButton).toBeInTheDocument();
    expect(rejectButton).toBeInTheDocument();
    expect(viewCookieLink).toBeInTheDocument();
  });

  it('should set cookiePreference to true when Accept analytics cookies is clicked', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><CookieBanner setIsCookieBannerShown={setIsCookieBannerShown} /></MemoryRouter>);

    const acceptButton = screen.getByRole('button', { name: 'Accept analytics cookies' });
    await user.click(acceptButton);
    expect(extractPreferenceCookie('cookiePreference')).toEqual('cookiePreference=true');
  });

  it('should set cookiePreference to false when Reject analytics cookies is clicked', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><CookieBanner setIsCookieBannerShown={setIsCookieBannerShown} /></MemoryRouter>);

    const rejectButton = screen.getByRole('button', { name: 'Reject analytics cookies' });
    await user.click(rejectButton);
    expect(extractPreferenceCookie('cookiePreference')).toEqual('cookiePreference=false');
  });

  it('should show the confirmation banner when accept is clicked', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><CookieBanner setIsCookieBannerShown={setIsCookieBannerShown} /></MemoryRouter>);

    const acceptButton = screen.getByRole('button', { name: 'Accept analytics cookies' });
    await user.click(acceptButton);

    expect(screen.getByTestId('cookieMessage')).toHaveTextContent('You\'ve accepted analytics cookies. You can change your cookie settings at any time.');
    expect(screen.queryByText('We use some essential cookies to make this service work.')).not.toBeInTheDocument();
    expect(acceptButton).not.toBeInTheDocument();
  });

  it('should show the confirmation banner when reject is clicked', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><CookieBanner setIsCookieBannerShown={setIsCookieBannerShown} /></MemoryRouter>);

    const rejectButton = screen.getByRole('button', { name: 'Reject analytics cookies' });
    await user.click(rejectButton);

    expect(screen.getByTestId('cookieMessage')).toHaveTextContent('You\'ve rejected analytics cookies. You can change your cookie settings at any time.');
    expect(screen.queryByText('We use some essential cookies to make this service work.')).not.toBeInTheDocument();
    expect(rejectButton).not.toBeInTheDocument();
  });

  // Test to hide the banner is in App.test.jsx

  it('should call setIsCoookieBannerShown once hide cookie message is clicked after user accepts or rejects cookies', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><CookieBanner setIsCookieBannerShown={setIsCookieBannerShown} /></MemoryRouter>);

    const acceptButton = screen.getByRole('button', { name: 'Accept analytics cookies' });
    await user.click(acceptButton);

    const hideButton = screen.getByRole('button', { name: 'Hide cookie message' });

    await user.click(hideButton);

    expect(setIsCookieBannerShown).toHaveBeenCalled();
  });
});

