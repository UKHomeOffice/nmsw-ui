import {
  VALIDATE_CONDITIONAL,
  VALIDATE_EMAIL_ADDRESS,
  VALIDATE_FIELD_MATCH,
  VALIDATE_MAX_LENGTH,
  VALIDATE_MIN_LENGTH,
  VALIDATE_PHONE_NUMBER,
  VALIDATE_REQUIRED,
} from '../constants/AppConstants';

const validateField = ({ type, value, condition }) => {
  switch (type) {
    case VALIDATE_REQUIRED:
      if (!value || value.trim() === '') {
        return 'error';
      }
      break;
    case VALIDATE_MAX_LENGTH:
      if (value && value.length > condition) {
        return 'error';
      }
      break;
    case VALIDATE_MIN_LENGTH:
      if (value && value.length < condition) {
        return 'error';
      }
      break;
    case VALIDATE_EMAIL_ADDRESS:
      if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
        return 'error';
      }
      break;
    case VALIDATE_FIELD_MATCH:
      if (value && value !== condition.valueToMatch) {
        return 'error';
      }
      break;
    case VALIDATE_PHONE_NUMBER:
      if (value && !/^\([0-9]+\)[0-9]+$/i.test(value)) {
        return 'error';
      }
      break;
    default: return 'valid';
  }
};

const Validator = ({ formData, formFields }) => {
  const fieldsToValidate = Object.entries(formData).reduce((result, field) => { // result is our accumulator that starts as an empty array as defined at end of reduce
    const key = field[0];
    const value = field[1];
    const rules = formFields.find(field => field.fieldName === key) ? formFields.find(field => field.fieldName === key).validation : null; // find all the rules for this field, if any

    if (rules) {
      rules.map((rule) => {
        if (rule.type === VALIDATE_CONDITIONAL) {
          // check if the conditional field is visible (it's parent field is selected)
          const conditionalFieldIsVisible = value === rule.condition.parentValue;
          const foundValue = formData[rule.condition.fieldName];
          const ruleToTest = { type: rule.condition.ruleToTest, message: rule.condition.message };

          if (conditionalFieldIsVisible) {
            result.push({ key: rule.condition.fieldName, value: foundValue, rule: ruleToTest });
          }
        } else if (rule.type === VALIDATE_FIELD_MATCH) {
          result.push({
            key: key,
            value: value,
            rule: {
              type: rule.type,
              message: rule.message,
              condition: {
                valueToMatch: formData[rule.condition],
              }
            }
          });
        } else {
          result.push({ key, value, rule }); // for each rule for this field, push an entry to the result array
        }
      });
    }
    return result; // we will then have an array with unique(field + rule), and if a field has more than one rule it will have multiple entries in the array
  }, []);

  // Now for each entry in field to validate we can call the validator and see if it errors
  const errors = fieldsToValidate.reduce((result, field) => {
    const resp = validateField({ type: field.rule.type, value: field.value, condition: field.rule.condition });
    if (resp === 'error') {
      result.push({ name: field.key, message: field.rule.message });
    }
    return result;
  }, []);

  return errors;
};

export default Validator;
