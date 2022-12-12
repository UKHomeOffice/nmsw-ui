import { useNavigate } from 'react-router-dom';
import { REGISTER_ACCOUNT_ENDPOINT } from '../../constants/AppAPIConstants';
import { FIELD_EMAIL, VALIDATE_EMAIL_ADDRESS, VALIDATE_FIELD_MATCH, VALIDATE_REQUIRED } from '../../constants/AppConstants';
import { REGISTER_DETAILS } from '../../constants/AppUrlConstants';
import usePostData from '../../hooks/usePostData';
import DisplayForm from '../../components/DisplayForm';

const SupportingText = () => {
  return (
    <>
      <div className="govuk-inset-text">
        <p className="govuk-body">This will only be used if you need to recover your sign in details.</p>
        <p className="govuk-body">To confirm it is your email address we will send you a verification link.</p>
      </div>
    </>
  );
};

const RegisterEmailAddress = () => {
  const navigate = useNavigate();

  const formActions = {
    submit: {
      className: 'govuk-button',
      dataModule: 'govuk-button',
      dataTestid: 'submit-button',
      label: 'Continue',
      type: 'button',
    },
  };
  const formFields = [
    {
      type: FIELD_EMAIL,
      fieldName: 'emailAddress',
      label: 'Email address',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter an email address in the correct format, like name@example.com'
        },
        {
          type: VALIDATE_EMAIL_ADDRESS,
          message: 'Enter an email address in the correct format, like name@example.com'
        },
      ]
    },
    {
      type: FIELD_EMAIL,
      fieldName: 'repeatEmailAddress',
      label: 'Confirm email address',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Confirm your email address'
        },
        {
          type: VALIDATE_FIELD_MATCH,
          message: 'Your email addresses must match',
          condition: 'emailAddress',
        },
      ]
    }
  ];

  const handleSubmit = async (formData) => {
    try {
      const response = await usePostData({
        url: REGISTER_ACCOUNT_ENDPOINT,
        dataToSubmit: {
          email: formData.formData.emailAddress,
        }
      });
      if (response && response.id) { // using response.id as the indicator of success as status isn't passed back on success yet
        navigate(REGISTER_DETAILS);
      } else {
        console.log('error', response);
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-three-quarters">
        <DisplayForm
          formId='formRegisterEmailAddress'
          fields={formFields}
          formActions={formActions}
          pageHeading='What is your email address'
          handleSubmit={handleSubmit}
        >
          <SupportingText />
        </DisplayForm>
      </div>
    </div>
  );
};

export default RegisterEmailAddress;
