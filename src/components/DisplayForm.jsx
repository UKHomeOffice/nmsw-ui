import { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../context/userContext';
import determineFieldType from './formFields/DetermineFieldType';

const DisplayForm = ({ errors, fields, formId, formActions, handleSubmit, setErrors }) => {
  const { user } = useContext(UserContext);
  const fieldsRef = useRef(null);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    if (errors) {
      // on change any error shown for that field should be cleared so find if field has an error & remove from error list
      const filteredErrors = errors?.filter(errorField => errorField.name !== e.target.name);
      setErrors(filteredErrors);
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const scrollToErrorField = (e, error) => {
    e.preventDefault();
    const fieldMap = getFieldMap();
    const fieldLabelNode = fieldMap.get(error.name);
    fieldLabelNode.scrollIntoView();
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
   */
  useEffect(() => {
    const mappedFields = fields.map((field) => {
      return { fieldName: field.fieldName, value: field.value };
    });
    // convert the array of objects into a single object
    const objectOfMappedFields = Object.assign({}, ...mappedFields.map(field => ({ [field.fieldName]: field.value })));
    setFormData(objectOfMappedFields);
  }, [user, setFormData]);

  if (!formActions || !fields) { return null; }
  return (
    <form id={formId} autoComplete="off">
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
      {
        fields.map((field) => {
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
          type={formActions.submit.type}
          className={formActions.submit.className}
          data-module={formActions.submit.dataModule}
          data-testid={formActions.submit.dataTestid}
          onClick={(e) => handleSubmit(e, { formData })}
        >
          {formActions.submit.label}
        </button>
        {
          formActions.cancel && <button
            type={formActions.cancel.type}
            className={formActions.cancel.className}
            data-module={formActions.cancel.dataModule}
            data-testid={formActions.cancel.dataTestid}
          >
            {formActions.cancel.label}
          </button>
        }
      </div>
    </form>
  );
};

export default DisplayForm;

DisplayForm.propTypes = {
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ),
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
  formActions: PropTypes.objectOf(
    PropTypes.shape({
      className: PropTypes.string.isRequired,
      dataModule: PropTypes.string,
      dataTestid: PropTypes.string,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ),
  handleSubmit: PropTypes.func.isRequired,
  setErrors: PropTypes.func
};
