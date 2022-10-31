import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { SERVICE_NAME } from '../constants/AppConstants';
import { COOKIE_URL } from '../constants/AppUrlConstants';
import setAnalyticCookie from '../utils/setAnalyticCookie';

const CookieBanner = ({ setIsCookieBannerShown }) => {

  const [isAnalyticsButtonClicked, setIsAnalyticsButtonClicked] = useState(false);
  const [isAnalyticsAcceptedOrRejected, setIsAnalyticsAcceptedOrRejected] = useState('');

  return (
    <>
      {!isAnalyticsButtonClicked && <div className="govuk-cookie-banner " data-nosnippet role="region" aria-label={`Cookies on ${SERVICE_NAME}`}>
        <div className="govuk-cookie-banner__message govuk-width-container">

          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <h2 className="govuk-cookie-banner__heading govuk-heading-m">{`Cookies on ${SERVICE_NAME}`}</h2>

              <div className="govuk-cookie-banner__content">
                <p className="govuk-body">We use some essential cookies to make this service work.</p>
                <p className="govuk-body">We&apos;d also like to use analytics cookies so we can understand how you use the service and make improvements.</p>
              </div>
            </div>
          </div>

          <div className="govuk-button-group">
            <button type="button" className="govuk-button" data-module="govuk-button" onClick={() => {
              setAnalyticCookie(true);
              setIsAnalyticsButtonClicked(true);
              setIsAnalyticsAcceptedOrRejected('accepted');
            }}>
              Accept analytics cookies
            </button>
            <button type="button" className="govuk-button" data-module="govuk-button" onClick={() => {
              setAnalyticCookie(false);
              setIsAnalyticsButtonClicked(true);
              setIsAnalyticsAcceptedOrRejected('rejected');
            }}>
              Reject analytics cookies
            </button>
            <Link className="govuk-link" to={COOKIE_URL}>View cookies</Link>
          </div>
        </div>
      </div>}

      {isAnalyticsButtonClicked && <div className="govuk-cookie-banner " data-nosnippet role="region" aria-label="Cookies on [name of service]">
        <div className="govuk-cookie-banner__message govuk-width-container">

          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">

              <div className="govuk-cookie-banner__content">
                <p className="govuk-body" data-testid="cookieMessage">{`You've ${isAnalyticsAcceptedOrRejected} analytics cookies. You can `}
                  {/* No option to change cookies currently, this will be built later*/}
                  <Link className="govuk-link" to={COOKIE_URL}>change your cookie settings</Link>
                  {' at any time.'}
                </p>
              </div>
            </div>
          </div>

          <div className="govuk-button-group">
            <button className="govuk-button" data-module="govuk-button" type="button" onClick={() => { setIsCookieBannerShown(false); }}>
              Hide cookie message
            </button>
          </div>
        </div>
      </div>}
    </>
  );
};

export default CookieBanner;

CookieBanner.propTypes = {
  setIsCookieBannerShown: PropTypes.func.isRequired,
};
