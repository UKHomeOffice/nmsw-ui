import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import {
  FIELD_EMAIL,
  FIELD_PASSWORD,
  VALIDATE_EMAIL_ADDRESS,
  VALIDATE_REQUIRED,
  } from '../../constants/AppConstants';
import { DASHBOARD_URL } from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/DisplayForm';

const SignIn = (userDetails) => {
  const tempHardCodedUser = Object.entries(userDetails).length > 0 ? userDetails.user : { name: 'MockedUser' };
  const { signIn } = useContext(UserContext);
  const navigate = useNavigate();

  // Form fields
  const formActions = {
    submit: {
      label: 'Sign in',
    }
  };
  const formFields = [
    {
      type: FIELD_EMAIL,
      label: 'Email address',
      hint: 'Enter the email address you used when you created your account',
      fieldName: 'email',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your email address',
        },
        {
          type: VALIDATE_EMAIL_ADDRESS,
          message: 'Enter your email address in the correct format, like name@example.com',
        },
      ],
    },
    {
      type: FIELD_PASSWORD,
      label: 'Password',
      fieldName: FIELD_PASSWORD, // fieldname must be password as when fieldname is password we do not store value to session storage
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your password',
        },
      ],
    },
  ];

  const handleSubmit = () => {
    signIn({ ...tempHardCodedUser });
    navigate(DASHBOARD_URL);
  };

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <DisplayForm
          pageHeading="Sign in"
          formId='formSignIn'
          fields={formFields}
          formActions={formActions}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default SignIn;
