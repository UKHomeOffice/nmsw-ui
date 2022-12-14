import Auth from '../Auth';

describe('Auth.js', () => {
  const testToken = 'test';

  afterAll(() => {
    sessionStorage.clear();
  });

  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should store a token in session storage', () => {
    Auth.storeToken(testToken);
    expect(sessionStorage.getItem('token')).toBe(testToken);
  });

  it('should retrieve a token from session storage', () => {
    sessionStorage.setItem('token', testToken);
    expect(Auth.retrieveToken()).toBe(testToken);
  });

  it('should clear session storage', () => {
    sessionStorage.setItem('token', testToken);
    Auth.logout();
    expect(sessionStorage.getItem('token')).toBe(null);
  });

  describe('isAuthorised', () => {
    it('should be truthy when a token is in session storage', () => {
      sessionStorage.setItem('token', testToken);
      expect(Auth.isAuthorized()).toBeTruthy();
    });

    it('should be falsy when a token is not in session storage', () => {
      expect(Auth.isAuthorized()).toBeFalsy();
    });
  });
});
