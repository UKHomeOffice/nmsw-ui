import { useState } from 'react';
import PropTypes from 'prop-types';

const InputPhoneNumber = ({ fieldDetails, handleChange }) => {
  const [countryCode, setCountryCode] = useState(fieldDetails.value.split('(').pop().split(')')[0] || null);
  const [phoneNumber, setPhoneNumber] = useState(fieldDetails.value.split(')')[1] || null);

  const formatDataAndHandleChange = (e) => {
    let countryCodeEntered = countryCode || '';
    let phoneNumberEntered = phoneNumber || '';

    if (e.target.name === `${fieldDetails.fieldName}CountryCode`) {
      setCountryCode(e.target.value);
      countryCodeEntered = e.target.value;
    } else if (e.target.name === `${fieldDetails.fieldName}PhoneNumber`) {
      setPhoneNumber(e.target.value);
      phoneNumberEntered = e.target.value;
    }

    const formattedItemToAdd = {
      target: {
        name: fieldDetails.fieldName,
        value: `(${countryCodeEntered})${phoneNumberEntered}`,
      }
    };

    handleChange(formattedItemToAdd);
  };

  return (
    <div className="phoneNumber-input">
      <input
        className="govuk-input govuk-input--width-5 phoneNumber-input_country-code"
        id={`${fieldDetails.fieldName}-input[0]`}
        name={`${fieldDetails.fieldName}CountryCode`}
        type="text"
        inputMode="numeric"
        onChange={formatDataAndHandleChange}
        onPaste={formatDataAndHandleChange}
        defaultValue={countryCode}
        aria-describedby={fieldDetails.hint ? `${fieldDetails.fieldName}-hint` : null}
      />
      <input
        className="govuk-input"
        id={`${fieldDetails.fieldName}-input[1]`}
        name={`${fieldDetails.fieldName}PhoneNumber`}
        type="tel"
        autoComplete="tel"
        onChange={formatDataAndHandleChange}
        onPaste={formatDataAndHandleChange}
        defaultValue={phoneNumber}
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
