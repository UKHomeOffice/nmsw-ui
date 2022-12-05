import { useNavigate } from 'react-router-dom';
import { FIELD_EMAIL, VALIDATE_EMAIL_ADDRESS, VALIDATE_FIELD_MATCH, VALIDATE_REQUIRED } from '../../constants/AppConstants';
import { REGISTER_DETAILS } from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/DisplayForm';

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

  const handleSubmit = async (e, formData) => {
    console.log('submit', e, formData);
    navigate(REGISTER_DETAILS);
  };

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <DisplayForm
          formId='formRegisterEmailAddress'
          fields={formFields}
          formActions={formActions}
          pageHeading='Second page'
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default RegisterEmailAddress;
