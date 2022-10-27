import { useLocation, useNavigate } from 'react-router-dom';

const ConfirmFormSubmission = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) { 
    console.log('Confirmation page tried to load without any state');
    return (<p>Something went wrong, check your form submissions and try again</p>);
  }
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <div className="govuk-panel govuk-panel--confirmation">
          <h1 className="govuk-panel__title">
            {`${state.formName} submitted`}
          </h1>
          {state.referenceNumber &&
            <div className="govuk-panel__body">
              Your reference number<br /><strong>{state.referenceNumber}</strong>
            </div>
          }
        </div>
        <p className="govuk-body">We have sent you a confirmation email.</p>

        <h2 className="govuk-heading-m">What happens next</h2>

        <p className="govuk-body">
          We&apos;ve sent your voyage plan to Border Force. They will contact you if they need more information.
        </p>

        <button
          className="govuk-button govuk-button--secondary"
          data-module="govuk-button"
          type="button"
          onClick={() => { navigate(state.nextPageLink); }}
        >
          Continue to home page
        </button>
      </div>
    </div>
  );
};

export default ConfirmFormSubmission;
