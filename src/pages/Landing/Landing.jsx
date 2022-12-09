import { Link } from 'react-router-dom';
import { SERVICE_NAME } from '../../constants/AppConstants';
import { DASHBOARD_URL, REGISTER_ACCOUNT, SIGN_IN_URL } from '../../constants/AppUrlConstants';
import useUserIsPermitted from '../../hooks/useUserIsPermitted';

const Landing = () => {

  const isAuthenticated = useUserIsPermitted();
  
  return (
    <>
      <h1 className="govuk-heading-l" data-testid="landing-h1">{SERVICE_NAME}</h1>
      <p className="govuk-body">Use this service to:</p>
      <p className="govuk-body" data-testid="createAccountParagraph">You&apos;ll also need to sign in or <Link to ={REGISTER_ACCOUNT}>create an account</Link> to use this service</p>
      <Link 
        to={isAuthenticated ? DASHBOARD_URL : SIGN_IN_URL}
        role="button"
        draggable="false"
        className="govuk-button govuk-button--start"
        data-module="govuk-button"
      >
        Start now
        <svg 
          className="govuk-button__start-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="17.5"
          height="19"
          viewBox="0 0 33 40"
          aria-hidden="true"
          focusable="false"
        >
          <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
        </svg>
      </Link>
    </>
  );
};

export default Landing;
