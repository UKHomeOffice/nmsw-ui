import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { EXPANDED_DETAILS, FIELD_CONDITIONAL, FIELD_PASSWORD } from '../constants/AppConstants';
import { UserContext } from '../context/userContext';
import determineFieldType from './formFields/DetermineFieldType';
import { scrollToTop } from '../utils/ScrollToElement';
import Validator from '../utils/Validator';

const DisplayForm = ({ fields, formId, formActions, pageHeading, handleSubmit, children }) => {
  const { user } = useContext(UserContext);
  const fieldsRef = useRef(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState();
  const [fieldsWithValues, setFieldsWithValues] = useState();
  const [formData, setFormData] = useState({});
  const [sessionData, setSessionData] = useState(JSON.parse(sessionStorage.getItem('formData')));

  const handleChange = (e, itemToClear) => {
    // e may be an html event (e.g. radio button selected, text entered in input field)
    // or an object from an autocomplete field being selected

    if (errors) {
      // on change any error shown for that field should be cleared so find if field has an error & remove from error list
      const itemToCheck = itemToClear ? itemToClear.target.name : e.target.name;
      const filteredErrors = errors?.filter(errorField => errorField.name !== itemToCheck);
      setErrors(filteredErrors);
    }

    // create the dataset to store, accounting for objects coming from autocomplete
    const additionalDetails = e.target.additionalDetails
      ? { [`${[e.target.name]}${EXPANDED_DETAILS}`]: e.target.additionalDetails, [e.target.name]: e.target.value }
      : { [e.target.name]: e.target.value };

    const dataSet = {
      [e.target.name]: e.target.value,
      ...additionalDetails,
      [itemToClear?.target.name]: itemToClear?.target.value
    };

    // we do not store passwords in session data
    if (e.target.name !== FIELD_PASSWORD) {
      setSessionData({ ...sessionData, ...dataSet });
      sessionStorage.setItem('formData', JSON.stringify({ ...sessionData, ...dataSet }));
    }
    // we do store all values into form data
    setFormData({ ...formData, ...dataSet });
  };

  const handleCancel = (redirectURL) => {
    sessionStorage.removeItem('formData');
    navigate(redirectURL);
  };

  const handleValidation = async (e, formData) => {
    e.preventDefault();
    const formErrors = await Validator({ formData: formData.formData, formFields: fields });
    setErrors(formErrors);

    if (formErrors.length < 1) {
      /*
       * Returning formData
       * some forms perform special actions on the formData post validation
       * e.g. CookiePolicy form will set cookie states
       * so we always pass formData back
       */
      handleSubmit(formData);
      sessionStorage.removeItem('formData');
    } else {
      scrollToTop();
    }
  };

  const scrollToErrorField = (e, error) => {
    e.preventDefault();
    const fieldMap = getFieldMap();
    const fieldLabelNode = fieldMap.get(error.name);
    fieldLabelNode?.scrollIntoView();
    // /* TODO: replace with useRef/forwardRef */
    // radio buttons and checkbox lists add their index key to their id so we can find and focus on them
    document.getElementById(`${error.name}-input`) ? document.getElementById(`${error.name}-input`).focus() : document.getElementById(`${error.name}-input[0]`).focus();
  };

  /* 
   * For field level ref we use a ref callback, which passes a function to the ref attribute
   * React calls the ref callback with the DOM node when it’s time to set the ref, & with null when it’s time to clear it. 
   * We can then access any ref within it by fieldMap.get(error.name) which relates to our field id.
   * 
   * This works here as the DOM node is within this component, however we can't use this method in the same
   * way to pass a ref down to the input as the input is in a different component and we need to forward the ref down
   * TODO: work out how to set, forward, and access ref in input component on error click so we can set focus on input
   */
  const getFieldMap = () => {
    if (!fieldsRef.current) {
      // Initialize the Map on first usage.
      fieldsRef.current = new Map();
    }
    return fieldsRef.current;
  };

  /* When we introduce RBAC we expect to have fields that are
   * editable, disabled, or hidden based on user permissions.
   * This useEffect can be refactored to include a permission test
   * (or to call a permission test hook) that determines if a field should be 
   * editable, viewable disabled, or hidden and return only editable/visible fields
   * to the form render
   * 
   * For now as we have no RBAC it just returns all fields as fields to include
   * It also checks session storage for stored values and applies them
   */

  // TODO: refactor this to be clearer
  useEffect(() => {
    let sessionDataArray;
    if (sessionData) {
      sessionDataArray = Object.entries(sessionData).map(item => { return { name: item[0], value: item[1] }; });
    }

    const mappedFormFields = fields.map((field) => {
      let valuesToAdd;
      const sessionDataValue = sessionDataArray?.find(sessionDataField => sessionDataField.name === field.fieldName);
      if (field.type === FIELD_CONDITIONAL) {
        const conditionalField = field.radioOptions.find(field => field.parentFieldValue === sessionDataValue?.value);
        const sessionConditionalValue = sessionDataArray?.find(sessionDataField => sessionDataField.name === conditionalField?.name);
        valuesToAdd = { ...field, value: sessionDataValue?.value, conditionalValueToFill: sessionConditionalValue };
      } else {
        valuesToAdd = { ...field, value: sessionDataValue?.value };
      }
      return (valuesToAdd);
    });

    setFieldsWithValues(mappedFormFields);

    const mappedFormData = fields.map((field) => {
      const sessionDataValue = sessionDataArray?.find(sessionDataField => sessionDataField.name === field.fieldName);
      return ({ fieldName: field.fieldName, value: sessionDataValue?.value });
    });
    const objectOfMappedFields = Object.assign({}, ...mappedFormData.map(field => ({ [field.fieldName]: field.value })));
    setFormData(objectOfMappedFields);
  }, [user, setFieldsWithValues, setFormData]);

  if (!formActions || !fieldsWithValues) { return null; }
  return (
    <>
      {errors?.length > 0 && (
        <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" data-module="govuk-error-summary">
          <h2 className="govuk-error-summary__title" id="error-summary-title">
            There is a problem
          </h2>
          <div className="govuk-error-summary__body">
            <ul className="govuk-list govuk-error-summary__list">
              {errors.map((error) => {
                return (
                  <li key={error.name}>
                    <button className="govuk-button--text"
                      onClick={(e) => { scrollToErrorField(e, error); }}
                    >
                      {error.message}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
      <h1 className="govuk-heading-l">{pageHeading}</h1>
      {children}
      <form id={formId} autoComplete="off">
        {
          fieldsWithValues.map((field) => {
            const error = errors?.find(errorField => errorField.name === field.fieldName);
            return (
              <div
                key={field.fieldName}
                id={field.fieldName}
                ref={(node) => {
                  const map = getFieldMap();
                  if (node) {
                    map.set(field.fieldName, node); // on mount adds the refs
                  } else {
                    map.delete(field.fieldName); // on unmount removes the refs
                  }
                }}
              >
                {
                  determineFieldType({
                    allErrors: errors,  // allows us to add the error handling logic for conditional fields
                    error: error?.message,
                    fieldDetails: field,
                    parentHandleChange: handleChange,
                  })
                }
              </div>
            );
          })
        }
        <div className="govuk-button-group">
          <button
            type='button'
            className='govuk-button'
            data-module='govuk-button'
            data-testid='submit-button'
            onClick={(e) => handleValidation(e, { formData })}
          >
            {formActions.submit.label}
          </button>
          {
            formActions.cancel && <button
              type='button'
              className='govuk-button govuk-button--secondary'
              data-module='govuk-button'
              data-testid='cancel-button'
              onClick={() => handleCancel(formActions.cancel.redirectURL)}
            >
              {formActions.cancel.label}
            </button>
          }
        </div>
      </form>
    </>
  );
};

export default DisplayForm;

DisplayForm.propTypes = {
  children: PropTypes.node, // allows any renderable object
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      fieldName: PropTypes.string.isRequired,
      hint: PropTypes.string,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      value: PropTypes.string,
    }),
  ).isRequired,
  formId: PropTypes.string.isRequired,
  formActions: PropTypes.shape({
    submit: PropTypes.shape({
      label: PropTypes.string.isRequired,
    }),
    cancel: PropTypes.shape({
      label: PropTypes.string.isRequired,
      redirectURL: PropTypes.string.isRequired
    })
  }
  ),
  pageHeading: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};
