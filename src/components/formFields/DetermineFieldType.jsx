import PropTypes from 'prop-types';
import {
  FIELD_AUTOCOMPLETE,
  FIELD_CONDITIONAL,
  FIELD_EMAIL,
  FIELD_PASSWORD,
  FIELD_PHONE,
  FIELD_TEXT,
  FIELD_RADIO
} from '../../constants/AppConstants';
import InputAutocomplete from './InputAutocomplete';
import InputConditional from './InputConditional';
import InputPhoneNumber from './InputPhoneNumber';
import InputRadio from './InputRadio';
import InputText from './InputText';

const GroupedInputs = ({ error, fieldName, fieldToReturn, hint, label }) => {
  return (
    <div className={error ? 'govuk-form-group govuk-form-group--error' : 'govuk-form-group'}>
      <fieldset className="govuk-fieldset">
        <legend className="govuk-fieldset__legend">
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

const determineFieldType = ({ allErrors, error, fieldDetails, parentHandleChange }) => {
  let fieldToReturn;
  switch (fieldDetails.type) {

    case FIELD_AUTOCOMPLETE: fieldToReturn =
      <InputAutocomplete
        error={error} // if error true, error styling applied to input
        fieldDetails={fieldDetails}
        handleChange={parentHandleChange}
        type='autocomplete'
      />;
      break;

    case FIELD_CONDITIONAL: fieldToReturn =
      <InputConditional
        errors={allErrors} // allows us to add the error handling logic for conditional fields only on those fields
        fieldDetails={fieldDetails}
        handleChange={parentHandleChange}
      />;
      break;

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

    case FIELD_PHONE: fieldToReturn =
      <InputPhoneNumber
        error={error}
        fieldDetails={fieldDetails}
        handleChange={parentHandleChange}
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

    case FIELD_TEXT: fieldToReturn =
      <InputText
        error={error}
        fieldDetails={fieldDetails}
        handleChange={parentHandleChange}
        type='text'
      />;
      break;

    default: fieldToReturn = null;
  }

  return (
    <>
      {fieldDetails.grouped ? <GroupedInputs
        allErrors={allErrors}
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
  allErrors: PropTypes.array,
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
  allErrors: PropTypes.array,
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
