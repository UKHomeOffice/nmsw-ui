import { render, screen, waitFor } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer tests', () => {

  it('should render the footer with Crown Copyright text', async () => {
    await waitFor(() => { render(<Footer />); });
    expect(screen.getByText('© Crown copyright')).toBeInTheDocument();
  });

  it('should render the Crown Copyright element with the class that contains the image', async () => {
    await waitFor(() => { render(<Footer />); });
    const checkCrownCopyrightLogo = screen.getByText('© Crown copyright');
    expect(checkCrownCopyrightLogo).toBeInTheDocument();
    expect(checkCrownCopyrightLogo.outerHTML).toEqual('<a class="govuk-footer__link govuk-footer__copyright-logo" href="/">© Crown copyright</a>');
  });

});