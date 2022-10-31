import { useEffect, useState } from 'react';
import AppRouter from './AppRouter';
import CookieBanner from './layout/CookieBanner';
import Footer from './layout/Footer';
import Header from './layout/Header';
import PhaseBanner from './layout/PhaseBanner';
// utils
import cookieToFind from './utils/cookieToFind';
import setAnalyticCookie from './utils/setAnalyticCookie';

const App = () => {

  const cookiePreference = cookieToFind('cookiePreference');
  const [isCookieBannerShown, setIsCookieBannerShown] = useState(true);

  useEffect(() => {
    setAnalyticCookie(cookiePreference);
    if (cookiePreference !== null) {
      setIsCookieBannerShown(false);
    }
  }, [cookiePreference]);

  return (
    <>
      {isCookieBannerShown === true && <CookieBanner isCookieBannerShown={isCookieBannerShown} setIsCookieBannerShown={setIsCookieBannerShown} /> }
      <Header />
      <div className="govuk-width-container">
        <PhaseBanner />
        {/* Back links will go in here and be visible on every page by default
        If we don't want that we will add logic on the back link component as to when 
        it should not show; */}
        <main className="govuk-main-wrapper govuk-main-wrapper--auto-spacing" id="content" role="main">
          <AppRouter setIsCookieBannerShown={setIsCookieBannerShown} />
        </main>
      </div>
      <Footer />
    </>
  );
};

export default App;
