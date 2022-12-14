import { useLocation, useNavigate } from 'react-router-dom';
import {
  FIELD_RADIO,
  FIELD_TEXT,
  FIELD_PHONE,
  MULTI_PAGE_FORM,
  VALIDATE_MAX_LENGTH,
  VALIDATE_PHONE_NUMBER,
  VALIDATE_REQUIRED
} from '../../constants/AppConstants';
import { REGISTER_PASSWORD } from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/DisplayForm';

const RegisterYourDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const formActions = {
    submit: {
      label: 'Continue',
    },
  };
  const formFields = [
    {
      type: FIELD_TEXT,
      fieldName: 'fullName',
      label: 'Full name',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your full name'
        },
      ]
    },
    {
      type: FIELD_TEXT,
      fieldName: 'companyName',
      label: 'Your company name',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your company name'
        },
      ]
    },
    {
      type: FIELD_PHONE,
      fieldName: 'phoneNumber',
      label: 'Phone number',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your phone number'
        },
        {
          type: VALIDATE_PHONE_NUMBER,
          message: 'Enter your country code and phone number'
        }
      ]
    },
    {
      type: FIELD_TEXT,
      fieldName: 'country',
      label: 'Country (3 digit country code)',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter country'
        },
        {
          type: VALIDATE_MAX_LENGTH,
          message: 'Enter 3 digit country code',
          condition: 3
        },
      ]
    },
    {
      type: FIELD_RADIO,
      className: 'govuk-radios govuk-radios--inline',
      fieldName: 'shippingAgent',
      grouped: true,
      label: 'Is your company a shipping agent?',
      radioOptions: [
        {
          label: 'Yes',
          name: 'shippingAgent',
          value: 'yes',
        },
        {
          label: 'No',
          name: 'shippingAgent',
          value: 'no',
        },
      ],
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Select is your company a shipping agent'
        },
      ]
    },
  ];

  const handleSubmit = async (formData) => {
    const dataToSubmit = { ...state?.dataToSubmit, ...formData.formData };
    console.log('submit', formData);
    navigate(REGISTER_PASSWORD, { state: { dataToSubmit: dataToSubmit } });
  };

  return (
    <>
      <DisplayForm
        formId='formRegisterYourDetails'
        fields={formFields}
        formActions={formActions}
        formType={MULTI_PAGE_FORM}
        pageHeading='Your details'
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default RegisterYourDetails;
