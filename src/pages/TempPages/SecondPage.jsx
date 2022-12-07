import { useNavigate } from 'react-router-dom';
import {
  FIELD_AUTOCOMPLETE,
  FIELD_CONDITIONAL,
  FIELD_TEXT,
  FIELD_RADIO,
  CHECKED_FALSE,
  VALIDATE_CONDITIONAL,
  VALIDATE_REQUIRED,
} from '../../constants/AppConstants';
import { DASHBOARD_PAGE_NAME, DASHBOARD_URL, FORM_CONFIRMATION_URL } from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/DisplayForm';
import { countries } from './TempMockList-countries';
import { portList } from './TempMockList-portList';

const SecondPage = () => {
  const navigate = useNavigate();

  const formActions = {
    submit: {
      label: 'Save',
    },
    cancel: {
      label: 'Cancel',
      redirectURL: DASHBOARD_URL
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
    {
      type: FIELD_CONDITIONAL,
      label: 'What is your favourite animal',
      fieldName: 'favAnimal',
      className: 'govuk-radios',
      grouped: true,
      radioOptions: [
        {
          radioField: true,
          label: 'Cat',
          name: 'favAnimal',
          value: 'cat',
        },
        {
          radioField: false,
          parentFieldValue: 'cat',
          label: 'Breed of cat',
          name: 'breedOfCat',
        },
        {
          radioField: true,
          label: 'Dog',
          name: 'favAnimal',
          value: 'dog',
        },
        {
          radioField: false,
          parentFieldValue: 'dog',
          hint: 'What sort of dogs do you like?',
          label: 'Breed of dog',
          name: 'breedOfDog',
        },
        {
          radioField: true,
          label: 'Rabbit',
          name: 'favAnimal',
          value: 'rabbit',
        },
        {
          radioField: true,
          label: 'Other',
          name: 'favAnimal',
          value: 'other',
        },
      ],
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Select your favourite animal',
        },
        {
          type: VALIDATE_CONDITIONAL,
          condition: {
            parentValue: 'dog',
            fieldName: 'breedOfDog',
            ruleToTest: VALIDATE_REQUIRED,
            message: 'Enter a breed of dog'
          },
        },
        {
          type: VALIDATE_CONDITIONAL,
          condition: {
            parentValue: 'cat',
            fieldName: 'breedOfCat',
            ruleToTest: VALIDATE_REQUIRED,
            message: 'Enter a breed of cat'
          },
        }
      ],
    },
    {
      type: FIELD_AUTOCOMPLETE,
      label: 'Select your country',
      fieldName: 'country',
      dataAPIEndpoint: countries,
      responseKey: 'name',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Select your country from the list',
        },
      ],
    },
    {
      type: FIELD_AUTOCOMPLETE,
      label: 'Select your port',
      fieldName: 'port',
      dataAPIEndpoint: portList,
      responseKey: 'name',
      additionalKey: 'unlocode',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Select your port from the list',
        },
      ],
    },
  ];

  const handleSubmit = ({ formData }) => {
    let referenceNumber;
    if (formData.countryExpandedDetails?.country && formData.portExpandedDetails?.port) {
      referenceNumber = `CountryCode: ${formData.countryExpandedDetails.country.code}, Port: ${formData.portExpandedDetails.port.unlocode}`;
    } else {
      referenceNumber = `Country: ${formData.country}, Port: ${formData.port}`;
    }

    navigate(
      FORM_CONFIRMATION_URL,
      {
        state: {
          formName: 'Second page',
          nextPageLink: DASHBOARD_URL,
          nextPageName: DASHBOARD_PAGE_NAME,
          referenceNumber: referenceNumber
        }
      }
    );
  };

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <DisplayForm
          pageHeading="Second page"
          formId='formSecondPage'
          fields={formFields}
          formActions={formActions}
          handleSubmit={handleSubmit}
        />
      </div >
    </div>
  );
};

export default SecondPage;
