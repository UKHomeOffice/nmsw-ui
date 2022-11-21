import { Fragment } from 'react';
import PropTypes from 'prop-types';

const InputConditional = ({ autoComplete, error, fieldDetails, handleChange, type, checkedOption }) => {

  const classToApplyGroup = error ? 'govuk-form-group govuk-form-group--error' : 'govuk-form-group';
  const classToApplyInput = error ? 'govuk-input govuk-!-width-one-half govuk-input--error' : 'govuk-input govuk-!-width-one-';
  console.log(checkedOption);
  return (
    <div className={fieldDetails.className} data-module="govuk-radios">
      {(fieldDetails.radioOptions).map((option, index) => {
        const checkedState = fieldDetails.value === option.value ? true : option.checked;
        // Sets class depending on checked state
        const conditionalClass = checkedOption?.checked ? 'govuk-radios__conditional' : 'govuk-radios__conditional govuk-radios__conditional--hidden';
        // Makes sure the conditonal inputs open and close separately when clicked on
        const showConditionalInput = checkedOption?.value === option.value ? true : false;
        return (
          <Fragment key={option.id}>
            <div className="govuk-radios__item">
              <input
                className="govuk-radios__input"
                id={`${option.name}-input[${index}]`}
                autoComplete={autoComplete}
                name={option.name}
                value={option.value}
                type={type}
                onChange={handleChange}
                defaultChecked={checkedState}
                aria-describedby={option.hint ? `${fieldDetails.fieldName}${option.name}-hint` : null}
              />
              <label className="govuk-label govuk-radios__label" htmlFor={`${option.name}-input[${index}]`}>
                {option.label}
              </label>
            </div>
            {/* 
            - If option with conditional is preseleted then it is not showing the input on refresh or page load
            - checkedState does not change unless page is refreshed so if we select 'dog', refresh, then click on 'cat', the conditional field does not hide
            */}
            {showConditionalInput && <div className={conditionalClass}>
              <div className={classToApplyGroup}>
                <label className="govuk-label" htmlFor={`${option.conditionalName}-input`}>
                  {option.conditionalLabel}
                </label>
                <p id={`${option.conditionalName}-error`} className="govuk-error-message">
                  <span className="govuk-visually-hidden">Error:</span> {error}
                </p>
                <input
                  className={classToApplyInput}
                  id={`${option.conditionalName}-input`}
                  name={option.conditionalName}
                  type='text'
                  onChange={handleChange}
                  onPaste={handleChange}
                />
              </div>
            </div>}
          </Fragment>
        );
      })}
    </div>
  );
};

InputConditional.propTypes = {
  autoComplete: PropTypes.string,
  fieldDetails: PropTypes.shape({
    fieldName: PropTypes.string.isRequired,
    hint: PropTypes.string,
    className: PropTypes.string,
    radioOptions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        checked: PropTypes.bool,
        conditional: PropTypes.bool,
        labelConditional: PropTypes.string,
      })).isRequired,
    value: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default InputConditional;
