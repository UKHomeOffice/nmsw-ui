import { Link, useLocation } from 'react-router-dom';
import { SIGN_IN_URL } from '../../constants/AppUrlConstants';

const RegisterConfirmation = () => {
  const { state } = useLocation();

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-three-quarters">
        <div className="govuk-panel govuk-panel--confirmation">
          <h1 className="govuk-panel__title">
            Account created
          </h1>
          {state.companyName &&
            <div className="govuk-panel__body">
              {`${state.companyName} has been setup.`}
            </div>
          }
        </div>
        <h2 className="govuk-heading-m">What happens next</h2>

        <p className="govuk-body">
          <Link to={SIGN_IN_URL}>Sign in</Link> to start using this service.
        </p>
      </div>
    </div>
  );
};

export default RegisterConfirmation;
