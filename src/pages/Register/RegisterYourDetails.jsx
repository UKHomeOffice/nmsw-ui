import { useNavigate } from 'react-router-dom';
import {
  FIELD_RADIO,
  FIELD_TEXT,
  MULTI_PAGE_FORM,
  VALIDATE_REQUIRED
} from '../../constants/AppConstants';
import { REGISTER_PASSWORD } from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/DisplayForm';

const RegisterYourDetails = () => {
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
      type: FIELD_TEXT,
      fieldName: 'country',
      label: 'Country',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter country'
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
    },
  ];

  const handleSubmit = async (e, formData) => {
    // This will trigger a PATCH to /registration endpoint
    // with { "email": "example@mail.com" }
    console.log('submit', e, formData);
    // and then take user to the next page
    navigate(REGISTER_PASSWORD);
  };

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <DisplayForm
          formId='formRegisterYourDetails'
          fields={formFields}
          formActions={formActions}
          formType={MULTI_PAGE_FORM}
          pageHeading='Your details'
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default RegisterYourDetails;
