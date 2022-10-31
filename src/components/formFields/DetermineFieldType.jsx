import PropTypes from 'prop-types';
import {
  FIELD_EMAIL,
  FIELD_PASSWORD,
  FIELD_TEXT,
  FIELD_RADIO
} from '../../constants/AppConstants';
import InputRadio from './InputRadio';
import InputText from './InputText';

const GroupedInputs = ({ error, fieldName, fieldToReturn, hint, label }) => {
  return (
    <div className={error ? 'govuk-form-group govuk-form-group--error' : 'govuk-form-group'}>
      <fieldset className="govuk-fieldset">
        <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
          {label}
        </legend>
        <div id={`${fieldName}-hint`} className="govuk-hint">
          {hint}
        </div>
        <p id={`${fieldName}-error`} className="govuk-error-message">
          <span className="govuk-visually-hidden">Error:</span> {error}
        </p>
        {fieldToReturn}
      </fieldset>
    </div>
  );
};

const SingleInput = ({ error, fieldName, fieldToReturn, hint, label }) => {
  return (
    <div className={error ? 'govuk-form-group govuk-form-group--error' : 'govuk-form-group'}>
      <label className="govuk-label" htmlFor={`${fieldName}-input`}>
        {label}
      </label>
      <div id={`${fieldName}-hint`} className="govuk-hint">
        {hint}
      </div>
      <p id={`${fieldName}-error`} className="govuk-error-message">
        <span className="govuk-visually-hidden">Error:</span> {error}
      </p>
      {fieldToReturn}
    </div>
  );
};

const determineFieldType = ({ error, fieldDetails, parentHandleChange }) => {
  let fieldToReturn;
  switch (fieldDetails.type) {

    case FIELD_EMAIL: fieldToReturn =
      <InputText
        autoComplete='email'
        error={error} // if error true, error styling applied to input
        fieldDetails={fieldDetails}
        handleChange={parentHandleChange}
        type='email'
      />;
      break;

    case FIELD_PASSWORD: fieldToReturn =
      <InputText
        error={error}
        fieldDetails={fieldDetails}
        handleChange={parentHandleChange}
        type='password'
        dataTestid={`${fieldDetails.fieldName}-passwordField`}
      />;
      break;

    case FIELD_TEXT: fieldToReturn =
      <InputText
        error={error}
        fieldDetails={fieldDetails}
        handleChange={parentHandleChange}
        type='text'
      />;
      break;

    case FIELD_RADIO: fieldToReturn =
      <InputRadio
         // there is no input level error styling on a radio button so we do not pass error down here
        fieldDetails={fieldDetails}
        handleChange={parentHandleChange}
        type='radio'
      />;
      break;

    default: fieldToReturn = null;
  }

  return (
    <>
      {fieldDetails.grouped ? <GroupedInputs
        error={error}
        fieldName={fieldDetails.fieldName}
        fieldToReturn={fieldToReturn}
        hint={fieldDetails.hint}
        label={fieldDetails.label}
      />
        :
        <SingleInput
          error={error}
          fieldName={fieldDetails.fieldName}
          fieldToReturn={fieldToReturn}
          hint={fieldDetails.hint}
          label={fieldDetails.label}
        />
      }
    </>
  );
};

export default determineFieldType;

determineFieldType.propTypes = {
  error: PropTypes.string,
  fieldDetails: PropTypes.objectOf(
    PropTypes.shape({
      fieldName: PropTypes.string.isRequired,
      hint: PropTypes.string,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      value: PropTypes.string,
    }),
  ),
  parentHandleChange: PropTypes.func.isRequired,
};

GroupedInputs.propTypes = {
  error: PropTypes.string,
  fieldName: PropTypes.string.isRequired,
  fieldToReturn: PropTypes.object.isRequired,
  hint: PropTypes.string,
  label: PropTypes.string.isRequired
};

SingleInput.propTypes = {
  error: PropTypes.string,
  fieldName: PropTypes.string.isRequired,
  fieldToReturn: PropTypes.object.isRequired,
  hint: PropTypes.string,
  label: PropTypes.string.isRequired
};
