import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { FIELD_RADIO, FIELD_TEXT } from '../../constants/AppConstants';

const RadioField = ({ index, label, name, value, handleChange }) => {
  return (
    <div className="govuk-radios__item">
      <input
        className="govuk-radios__input"
        id={`${name}-input[${index}]`}
        name={name}
        type={FIELD_RADIO}
        value={value}
        onChange={handleChange}
      />
      <label className="govuk-label govuk-radios__label" htmlFor={`${name}-input[${index}]`}>
        {label}
      </label>
    </div>
  );
};

const TextField = ({ hint, isVisible, label, name, handleChange }) => {
  return (
    <div data-testid={`${name}-container`} className={isVisible ? 'govuk-radios__conditional' : 'govuk-radios__conditional govuk-radios__conditional--hidden'}>
      <div className='govuk-form-group'>
        <label className="govuk-label" htmlFor={`${name}-input`}>
          {label}
        </label>
        <div id={`${name}-hint`} className="govuk-hint">
          {hint}
        </div>
        <input
          aria-describedby={hint ? `${name}-hint` : null}
          className="govuk-input govuk-!-width-one-third"
          id={`${name}-input`}
          name={name}
          type={FIELD_TEXT}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};


const InputConditional = ({ fieldDetails, handleChange }) => {
  const [checkedItem, setCheckedItem] = useState();

  const wrapHandleChange = async (e) => {
    let formattedItemToClear;
    if (e.target.type === FIELD_RADIO) {
      setCheckedItem(e.target.value);
      // find any currently active conditional fields and format it so it can be cleared with handleChange
      // (only one radio can be selected at a time so only one conditional can be open at a time)
      if (activeConditionalField) {
        document.getElementById(`${activeConditionalField.name}-input`).value = null;
        formattedItemToClear = {
          target: {
            name: activeConditionalField.name,
            value: null,
          }
        };
      }
      // find this radio option's conditional field (if any) and update the activeConditionalField
      // so we know to clear it if a new radio option is selected
      const conditionalField = fieldDetails.radioOptions.find(({ parentFieldValue }) => parentFieldValue === e.target.value);
      setActiveConditionalField(conditionalField);
    }
    // pass both the selected radioOption AND any conditionalField that needs to be cleared to handleChange
    // this is where formData and sessionData are then updated with the new values
    handleChange(e, formattedItemToClear);
  };

  return (
    <div className={fieldDetails.className} data-module="govuk-radios">
      {(fieldDetails.radioOptions).map((option, index) => {
        const isVisible = checkedItem === option.parentFieldValue ? true : false;
        return (
          <Fragment key={`${option.name}-input[${index}]`}>
            {
              option.radioField ?
                <RadioField
                  index={index}
                  label={option.label}
                  name={option.name}
                  value={option.value}
                  handleChange={wrapHandleChange}
                />
                :
                <TextField
                  hint={option.hint}
                  isVisible={isVisible}
                  label={option.label}
                  name={option.name}
                  handleChange={wrapHandleChange}
                />
            }
          </Fragment>
        );
      })}
    </div>
  );
};

RadioField.propTypes = {
  index: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

TextField.propTypes = {
  hint: PropTypes.string,
  isVisible: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

InputConditional.propTypes = {
  fieldDetails: PropTypes.shape({
    className: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
    hint: PropTypes.string,
    radioOptions: PropTypes.arrayOf(
      PropTypes.shape({
        radioField: PropTypes.bool.isRequired,
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.string,
      })).isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default InputConditional;
