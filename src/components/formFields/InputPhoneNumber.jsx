import PropTypes from 'prop-types';

const InputPhoneNumber = () => {

  return (
    <div className="govuk-form-group">
      phone grouped
    </div>
  );
};

InputPhoneNumber.propTypes = {
  fieldDetails: PropTypes.shape({
    fieldName: PropTypes.string.isRequired,
    hint: PropTypes.string,
    className: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default InputPhoneNumber;
