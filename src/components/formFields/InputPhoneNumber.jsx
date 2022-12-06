import PropTypes from 'prop-types';

const InputPhoneNumber = ({ fieldDetails, handleChange }) => {

  return (
    <div className="phoneNumber-input">
      <input
        className="govuk-input govuk-input--width-5 phoneNumber-input_country-code"
        id={`${fieldDetails.fieldName}CountryCode-input`} 
        name={`${fieldDetails.fieldName}CountryCode`}
        type="text"
        inputMode="numeric"
        onChange={handleChange}
        onPaste={handleChange}
        defaultValue={fieldDetails.value}
        aria-describedby={fieldDetails.hint ? `${fieldDetails.fieldName}-hint` : null}
      />
      <input
        className="govuk-input"
        id={`${fieldDetails.fieldName}PhoneNumber-input`} 
        name={`${fieldDetails.fieldName}PhoneNumber`}
        type="tel"
        autoComplete="tel"
        onChange={handleChange}
        onPaste={handleChange}
        defaultValue={fieldDetails.value}
        aria-describedby={fieldDetails.hint ? `${fieldDetails.fieldName}-hint` : null}
      />
  </div>
  );
};

InputPhoneNumber.propTypes = {
  fieldDetails: PropTypes.shape({
    fieldName: PropTypes.string.isRequired,
    hint: PropTypes.string,
    className: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default InputPhoneNumber;
