import { Link, useLocation } from 'react-router-dom';
import { LANDING_URL } from '../../constants/AppUrlConstants';

const GenericUnknownError = () => {
  const { state } = useLocation();
  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-xl">Error</h1>
          <p className="govuk-body">Something has gone wrong</p>
          <Link to={state?.redirectURL || LANDING_URL}>Click here to continue</Link>
        </div>
      </div>
    </>
  );
};

export default GenericUnknownError;
