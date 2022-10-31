import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DisplayForm from '../../components/DisplayForm';
import { FIELD_RADIO, CHECKED_TRUE, CHECKED_FALSE } from '../../constants/AppConstants';
import cookieToFind from '../../utils/cookieToFind';
import { scrollToElementId } from '../../utils/ScrollToElementId';
import setAnalyticCookie from '../../utils/setAnalyticCookie';

const CookiePolicy = ({ setIsCookieBannerShown }) => {

  const [isCookieConfirmationShown, setIsCookieConfirmationShown] = useState(false);
  const cookiePreference = cookieToFind('cookiePreference');

  let selected = cookiePreference === true ? CHECKED_TRUE : CHECKED_FALSE;

  const formActions = {
    submit: {
      className: 'govuk-button',
      dataModule: 'govuk-button',
      dataTestid: 'save-button',
      label: 'Save cookie settings',
      type: 'button',
    }
  };
  const formFields = [
    {
      type: FIELD_RADIO,
      label: 'Do you want to accept analytics cookies?',
      fieldName: 'cookieSettings',
      className: 'govuk-radios',
      grouped: true,
      radioOptions: [
        {
          label: 'Yes',
          name: 'cookieSettings',
          id: 'yes',
          value: 'true',
          checked: selected === CHECKED_TRUE
        },
        {
          label: 'No',
          name: 'cookieSettings',
          id: 'no',
          value: 'false',
          checked: selected === CHECKED_FALSE
        },
      ]
    },
  ];

  const handleSubmit = (e, formData) => {
    e.preventDefault();
    if (formData.formData.cookieSettings === CHECKED_TRUE.toString()) {
      setAnalyticCookie(true);
    } else {
      setAnalyticCookie(false);
    }
    setIsCookieBannerShown(false);
    setIsCookieConfirmationShown(true);
    
    if (isCookieConfirmationShown) {
      scrollToElementId('cookie-confirmation');
    }
  };

  useEffect(() => {
    if (isCookieConfirmationShown) {
      scrollToElementId('cookie-confirmation');
    }
  }, [isCookieConfirmationShown]);

  return (
    <>
      {isCookieConfirmationShown &&
        <div
          className="govuk-notification-banner govuk-notification-banner--success"
          role="alert"
          aria-labelledby="govuk-notification-banner-title"
          data-module="govuk-notification-banner"
          id="cookie-confirmation">
          <div className="govuk-notification-banner__header">
            <h2 className="govuk-notification-banner__title" id="govuk-notification-banner-title">
              Success
            </h2>
          </div>
          <div className="govuk-notification-banner__content">
            <p className="govuk-notification-banner__heading">
              You&apos;ve set your cookie preferences.
            </p>
          </div>
        </div>}
      <h1 className="govuk-heading-l">Cookies</h1>
      {/* Temporary <br /> tags so that you can see a scroll */}
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <h2 className="govuk-heading-l">Change your cookie settings</h2>
      <DisplayForm
        formId='changeYourCookieSettings'
        fields={formFields}
        formActions={formActions}
        handleSubmit={handleSubmit}
      />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
};

export default CookiePolicy;

CookiePolicy.propTypes = {
  setIsCookieBannerShown: PropTypes.func.isRequired,
};
