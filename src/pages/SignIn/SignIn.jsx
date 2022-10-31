import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import {
  FIELD_EMAIL,
  FIELD_PASSWORD,
  VALIDATE_EMAIL_ADDRESS,
  VALIDATE_MIN_LENGTH,
  VALIDATE_REQUIRED,
  } from '../../constants/AppConstants';
import { DASHBOARD_URL } from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/DisplayForm';
import { scrollToElementId } from '../../utils/ScrollToElementId';
import Validator from '../../utils/Validator';

const SignIn = (userDetails) => {
  const tempHardCodedUser = Object.entries(userDetails).length > 0 ? userDetails.user : { name: 'MockedUser' };
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [errors, setErrors] = useState();

  // Form fields
  const formActions = {
    submit: {
      className: 'govuk-button',
      dataModule: 'govuk-button',
      dataTestid: 'submit-button',
      label: 'Sign in',
      type: 'button',
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
      fieldName: 'password',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your password',
        },
      ],
    },
    {
      type: FIELD_PASSWORD,
      label: 'Sample min length password field for testing',
      hint: 'Because we would not show a min length error on sign in, only on account creations',
      fieldName: 'sampleMinLengthTest',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your sample field password',
        },
        {
          type: VALIDATE_MIN_LENGTH,
          message: 'Sample field must be a minimum of 8 characters',
          condition: 8,
        },
      ],
    }
  ];

  const handleSubmit = async (e, formData) => {
    e.preventDefault();
    const formErrors = await Validator({ formData: formData.formData, formFields: formFields });
    setErrors(formErrors);

    if (formErrors.length < 1) {
      login({ ...tempHardCodedUser });
      navigate(DASHBOARD_URL);
    } else {
      scrollToElementId('formSignIn');
    }
  };

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-l" data-testid="signin-h1">Sign in</h1>
        <DisplayForm
          formId='formSignIn'
          errors={errors}
          fields={formFields}
          formActions={formActions}
          handleSubmit={handleSubmit}
          setErrors={setErrors}
        />
      </div>
    </div>
  );
};

export default SignIn;
