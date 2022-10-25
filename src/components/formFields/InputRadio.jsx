import PropTypes from 'prop-types';

const InputRadio = ({ autoComplete, fieldDetails, handleChange, type }) => {

  return (
    <div className={fieldDetails.className} data-module="govuk-radios">
      {(fieldDetails.radioOptions).map((option) => {
        return (
          <div className="govuk-radios__item" key={option.id}>
            <input
              className="govuk-radios__input"
              id={`${option.id}-input`}
              autoComplete={autoComplete}
              name={option.name}
              value={option.value}
              type={type}
              onChange={handleChange}
              defaultChecked={option.checked}
              aria-describedby={option.hint ? `${fieldDetails.fieldName}${option.id}-hint` : null}
            />
            <label className="govuk-label govuk-radios__label" htmlFor={`${option.id}-input`}>
              {option.label}
            </label>
          </div>
        );
      })}
    </div>
  );
};


InputRadio.propTypes = {
  autoComplete: PropTypes.string,
  dataTestid: PropTypes.string,
  fieldDetails: PropTypes.shape({
    fieldName: PropTypes.string.isRequired,
    hint: PropTypes.string,
    value: PropTypes.string,
    className: PropTypes.string,
    radioOptions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        checked: PropTypes.bool
      }))
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default InputRadio;