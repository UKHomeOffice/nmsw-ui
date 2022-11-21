// import PropTypes from 'prop-types';

const InputConditional = ({ autoComplete, error, fieldDetails, handleChange, type }) => {

  const classToApplyGroup = error ? 'govuk-form-group govuk-form-group--error' : 'govuk-form-group';
  const classToApplyInput = error ? 'govuk-input govuk-!-width-one-half govuk-input--error' : 'govuk-input govuk-!-width-one-half';
  return (
    <div className={fieldDetails.className} data-module="govuk-radios">
        
            <div className="govuk-radios__item" key={fieldDetails.id}>
              <input
                className="govuk-radios__input"
                id={`${fieldDetails.fieldName}-input`}
                autoComplete={autoComplete}
                name={fieldDetails.name}
                value={fieldDetails.value}
                type={type}
                onChange={handleChange}
                aria-describedby={fieldDetails.hint ? `${fieldDetails.fieldName}-hint` : null}
              />
              <label className="govuk-label govuk-radios__label" htmlFor={`${fieldDetails.fieldName}-input`}>
                {fieldDetails.label}
              </label>
            </div>
            {/* 
            -sPCR uses formData to check whether the field is clicked - not generic. How to instantly check whether the field selected? 
            - checkedState only works after refresh
            - Without it being conditional, the top level error will error on the conditional too
            */}
              <div className="govuk-radios__conditional">
                <div className={classToApplyGroup} >
                  <label className="govuk-label" htmlFor={`${fieldDetails.conditionalField.fieldName}-input`}>
                    {fieldDetails.conditionalField.label}
                  </label>
                  <p id={`${fieldDetails.conditionalField.fieldName}-error`} className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span> {error}
                  </p>
                  <input
                    className={classToApplyInput}
                    id={`${fieldDetails.conditionalField.fieldName}-input`}
                    name={fieldDetails.conditionalField.fieldName}
                    type='text'
                    onChange={handleChange}
                    onPaste={handleChange}
                  />
                </div>
              </div>
    </div>
  );
};

// InputConditional.propTypes = {
//   autoComplete: PropTypes.string,
//   fieldDetails: PropTypes.shape({
//     fieldName: PropTypes.string.isRequired,
//     hint: PropTypes.string,
//     className: PropTypes.string,
//     radioOptions: PropTypes.arrayOf(
//       PropTypes.shape({
//         id: PropTypes.string.isRequired,
//         name: PropTypes.string.isRequired,
//         label: PropTypes.string.isRequired,
//         value: PropTypes.string.isRequired,
//         checked: PropTypes.bool,
//         conditional: PropTypes.bool,
//         labelConditional: PropTypes.string,
//       })).isRequired,
//     value: PropTypes.string,
//   }).isRequired,
//   handleChange: PropTypes.func.isRequired,
//   type: PropTypes.string.isRequired,
// };

export default InputConditional;
