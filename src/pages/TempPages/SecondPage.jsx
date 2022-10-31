import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FIELD_TEXT,
  FIELD_RADIO,
  CHECKED_FALSE,
  VALIDATE_REQUIRED,
} from '../../constants/AppConstants';
import { DASHBOARD_PAGE_NAME, DASHBOARD_URL, FORM_CONFIRMATION_URL } from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/DisplayForm';
import { scrollToElementId } from '../../utils/ScrollToElementId';
import Validator from '../../utils/Validator';

const SecondPage = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState();

  const formActions = {
    submit: {
      className: 'govuk-button',
      dataModule: 'govuk-button',
      dataTestid: 'submit-button',
      label: 'Save',
      type: 'button',
    }
  };
  const formFields = [
    {
      type: FIELD_TEXT,
      label: 'First name',
      hint: 'Enter your first name',
      fieldName: 'firstName',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your first name',
        },
      ],
    },
    {
      type: FIELD_RADIO,
      label: 'What is your favourite colour',
      fieldName: 'favouriteColour',
      className: 'govuk-radios',
      grouped: true,
      radioOptions: [
        {
          label: 'Red',
          name: 'favouriteColour',
          id: 'red',
          value: 'red',
          checked: CHECKED_FALSE
        },
        {
          label: 'Blue',
          name: 'favouriteColour',
          id: 'blue',
          value: 'blue',
          checked: CHECKED_FALSE
        },
        {
          label: 'Green',
          name: 'favouriteColour',
          id: 'green',
          value: 'green',
          checked: CHECKED_FALSE
        },
        {
          label: 'Other',
          name: 'favouriteColour',
          id: 'other',
          value: 'other',
          checked: CHECKED_FALSE
        },
      ],
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Select your favourite colour',
        },
      ],
    },
  ];

  const handleSubmit = async (e, formData) => {
    e.preventDefault();
    const formErrors = await Validator({ formData: formData.formData, formFields: formFields });
    setErrors(formErrors);

    if (formErrors.length < 1) {
      navigate(
        FORM_CONFIRMATION_URL,
        {
          state: {
            formName: 'Second page',
            nextPageLink: DASHBOARD_URL,
            nextPageName: DASHBOARD_PAGE_NAME,
            referenceNumber: '123'
          }
        }
      );
    } else {
      scrollToElementId('formSecondPage');
    }
  };

  return (
    <div className="govuk-grid-row">
      <h1>Second page</h1>
      <DisplayForm
        formId='formSecondPage'
        errors={errors}
        fields={formFields}
        formActions={formActions}
        handleSubmit={handleSubmit}
        setErrors={setErrors}
      />
    </div >
  );
};

export default SecondPage;
