import { useNavigate } from 'react-router-dom';
import {
  FIELD_EMAIL,
  MULTI_PAGE_FORM,
  VALIDATE_EMAIL_ADDRESS,
  VALIDATE_REQUIRED
} from '../../constants/AppConstants';
import { REGISTER_DETAILS_URL } from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/DisplayForm';

const RegisterEmailVerified = () => {
  const navigate = useNavigate();

  const formActions = {
    submit: {
      label: 'Continue',
    },
  };
  const formFields = [
    {
      type: FIELD_EMAIL,
      fieldName: 'emailAddress',
      label: 'Enter your email address',
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
  ];

  const handleSubmit = async (formData) => {
    const dataToSubmit = { ...formData.formData };
    navigate(REGISTER_DETAILS_URL, { state: { dataToSubmit: dataToSubmit } });
  };

  return (
    <>
      <DisplayForm
        formId='formRegisterEmailVerified'
        fields={formFields}
        formActions={formActions}
        formType={MULTI_PAGE_FORM}
        pageHeading='Your email address has been verified​'
        handleSubmit={handleSubmit}
      />
    </>
  );
};


export default RegisterEmailVerified;
