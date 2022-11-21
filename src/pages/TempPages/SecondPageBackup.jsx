import { useNavigate } from 'react-router-dom';
import {
  FIELD_TEXT,
  FIELD_RADIO,
  CHECKED_FALSE,
  VALIDATE_REQUIRED,
  FIELD_CONDITIONAL,
} from '../../constants/AppConstants';
import { DASHBOARD_PAGE_NAME, DASHBOARD_URL, FORM_CONFIRMATION_URL } from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/DisplayForm';

const SecondPage = () => {
  const navigate = useNavigate();

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
    {
      type: FIELD_CONDITIONAL,
      label: 'Cat',
      fieldName: 'favouriteAnimal',
      value: 'cat',
      checked: CHECKED_FALSE,
      conditionalField: {
        label: 'Enter your favourite type of cat',
        fieldName: 'catBreed',
        // validation: [
        //   {
        //     type: VALIDATE_REQUIRED,
        //     message: 'Enter your favourite cat breed',
        //   },
        // ],
      },
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your favourite cat breed',
        },
      ],
    },

    {
      type: FIELD_TEXT,
      label: 'Enter your favourite animal',
      fieldName: 'favouriteAnimalOther',
      className: 'govuk-radios__conditional govuk-radios__conditional--hidden',
      // validation: [
      //   {
      //     type: VALIDATE_REQUIRED,
      //     message: 'Enter your favourite animal',
      //   },
      // ],
    }
  ];

  const handleSubmit = ({ formData }) => {
    navigate(
      FORM_CONFIRMATION_URL,
      {
        state: {
          formName: 'Second page',
          nextPageLink: DASHBOARD_URL,
          nextPageName: DASHBOARD_PAGE_NAME,
          referenceNumber: `${formData.favouriteColour}-123`
        }
      }
    );
  };

  return (
    <div className="govuk-grid-row">
      <h1>Second page</h1>
      <DisplayForm
        formId='formSecondPage'
        fields={formFields}
        formActions={formActions}
        handleSubmit={handleSubmit}
      />
    </div >
  );
};

export default SecondPage;
