import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CookiePolicy from '../CookiePolicy';

const extractPreferenceCookie = (cookieName) => {
  const cookieArray = document.cookie.split(';');

  for (let i = 0; i < cookieArray.length; i++) {
    let cookiePair = cookieArray[i].split('=');
    if (cookieName == cookiePair[0].trim()) {
      return cookieArray[i];
    }
  }
};

describe('Cookie policy tests', () => {

  beforeEach(() => {
    document.cookie = 'cookiePreference=; Max-Age=0;';
  });

  it('should render a title of Cookies', async () => {
    render(<MemoryRouter><CookiePolicy /></MemoryRouter>);
    expect(screen.getByText('Cookies')).toBeInTheDocument();
  });

  it('should render form to change cookie settings', async () => {
    render(<MemoryRouter><CookiePolicy /></MemoryRouter>);
    expect(screen.getByText('Change your cookie settings')).toBeInTheDocument();
    expect(screen.getByText('Do you want to accept analytics cookies?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save cookie settings' })).toBeInTheDocument();
  });

  it('should prefill the no radio button if no cookiePreference', async () => {
    render(<MemoryRouter><CookiePolicy /></MemoryRouter>);
    expect(screen.getByRole('radio', { name: 'No' })).toBeChecked();
  });

  it('should prefill the yes radio button if cookiePreference is true', async () => {
    document.cookie = 'cookiePreference=true';
    render(<MemoryRouter><CookiePolicy /></MemoryRouter>);
    expect(screen.getByRole('radio', { name: 'Yes' })).toBeChecked();
  });

  it('should change cookiePreference to true when Save cookie settings is clicked', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><CookiePolicy /></MemoryRouter>);
    const yesRadio = screen.getByRole('radio', { name: 'Yes' });
    const saveCookies = screen.getByRole('button', { name: 'Save cookie settings' });

    expect(extractPreferenceCookie('cookiePreference')).toEqual(undefined);
    
    await user.click(yesRadio);
    await user.click(saveCookies);
    expect(extractPreferenceCookie('cookiePreference')).toEqual('cookiePreference=true');
  });

  it('should change cookiePreference to false when Save cookie settings is clicked', async () => {
    const user = userEvent.setup();
    document.cookie = 'cookiePreference=true';
    render(<MemoryRouter><CookiePolicy /></MemoryRouter>);
    const noRadio = screen.getByRole('radio', { name: 'No' });
    const saveCookies = screen.getByRole('button', { name: 'Save cookie settings' });

    expect(extractPreferenceCookie('cookiePreference')).toEqual('cookiePreference=true');
    
    await user.click(noRadio);
    await user.click(saveCookies);
    expect(extractPreferenceCookie('cookiePreference')).toEqual('cookiePreference=false');
  });
});
