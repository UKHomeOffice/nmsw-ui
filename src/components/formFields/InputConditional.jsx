import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { FIELD_RADIO, FIELD_TEXT } from '../../constants/AppConstants';

const RadioField = ({ checkedState, index, label, name, value, handleChange }) => {
  return (
    <div className="govuk-radios__item">
      <input
        className="govuk-radios__input"
        defaultChecked={checkedState}
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

const TextField = ({ hint, isVisible, label, name, value, handleChange }) => {
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
          defaultValue={value}
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
  const [activeConditionalField, setActiveConditionalField] = useState();
  const [checkedItem, setCheckedItem] = useState(fieldDetails.value);
  const [conditionalDefaultValue, setConditionalDefaultValue] = useState(fieldDetails.conditionalValueToFill?.value);

  const wrapHandleChange = (e) => {
    let formattedItemToClear;
    if (e.target.type === FIELD_RADIO) {
      setCheckedItem(e.target.value);
      // clear any current conditional fields (only one radio can be selected at a time so only one conditional can be open at a time)
      if (activeConditionalField) {
        document.getElementById(`${activeConditionalField.name}-input`).value = null;
        formattedItemToClear = {
          target: {
            name: activeConditionalField.name,
            value: null,
          }
        };
      }
      // find it's conditional field (if any) and update it
      const conditionalField = fieldDetails.radioOptions.find(({ parentFieldValue }) => parentFieldValue === e.target.value);
      setActiveConditionalField(conditionalField);
      setConditionalDefaultValue(null); // once the field is changed the default is no longer valid
    }
    handleChange(e, formattedItemToClear);
  };

  return (
    <div className={fieldDetails.className} data-module="govuk-radios">
      {(fieldDetails.radioOptions).map((option, index) => {
        const checkedState = checkedItem === option.value ? true : option.checked;
        const conditionalValuePrefill = checkedItem === option.parentFieldValue ? conditionalDefaultValue : null;
        
        const isVisible = checkedItem === option.parentFieldValue ? true : false;

        return (
          <Fragment key={`${option.name}-input[${index}]`}>
            {
              option.radioField ?
                <RadioField
                  checkedState={checkedState}
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
                  value={conditionalValuePrefill}
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
  checkedState: PropTypes.bool,
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
  value: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
};

InputConditional.propTypes = {
  fieldDetails: PropTypes.shape({
    className: PropTypes.string.isRequired,
    conditionalValueToFill: PropTypes.object,
    fieldName: PropTypes.string.isRequired,
    hint: PropTypes.string,
    radioOptions: PropTypes.arrayOf(
      PropTypes.shape({
        radioField: PropTypes.bool.isRequired,
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.string,
      })).isRequired,
    value: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default InputConditional;
