import { useState } from 'react';
import Autocomplete from 'accessible-autocomplete/react';
// import { portList } from '../../pages/TempPages/TempMockList-port';
import { countries } from '../../pages/TempPages/TempMockList-country';

// there is an open PR to fix the aria-activedescendent issue: 
// https://github.com/alphagov/accessible-autocomplete/issues/434
// https://github.com/alphagov/accessible-autocomplete/pull/553/files

// The aria-activedescendent looks to work correctly, if you use your mouse to select an item from the list
// then aria-activedescendent's value changes and voice over reads it out correctly
// The error occurs because when the combobox pop up (list) is closed, the value of aria-activedescendent is set to = 'false'
// and false is an invalid value for it.

// some explanation of aria-activedescendant: https://www.holisticseo.digital/technical-seo/web-accessibility/aria-activedescendant/

const Sugggester = () => {
  // needs to take in
    // defaultValue - for if there is a value to prepop
    // endpoint for getting data
    // response key to show (or if statement if merged) if statement (so for port, we have if statement around unlocode perhaps, for country it's just result = name)
  

  // userQuery is what user is typing



  const defaultValue = ''; // can assume we pass this in on props
  const [currentValue, setCurrentValue] = useState(defaultValue);

  const suggest = (userQuery, populateResults) => {
    // We should look at using lodash.debounce to prevent calls being made too fast as user types
    // We also need to add in a restrictor so we only start searching once a user has entered the second character
    
    // this will be replaced with the api call to return the first [x] values of the dataset
    const apiResponseData = countries;

    // adding a filter in here to mimic the userQuery being used to get a response
    // this will be replaced with the api call to return a filtered dataset based on the userQuery
    const filteredResults = apiResponseData.filter(o => Object.keys(o).some(k => o[k].toLowerCase().includes(userQuery.toLowerCase())));

    // this is part of the Autocomplete componet and how we return results to the list
    populateResults(filteredResults);
  };

  const handleOnConfirm = (e) => {
    setCurrentValue(e);
  };

  function template(result) {
    // using just a source list and not the templates in the autocomplete component results in console errors
    // related to specifying the input as `readonly` instead of `readOnly` and therefore the value being invalid
    // using the templates method to populate the list removes those errors
    // we can also use the template function to format the unlocode/name into a valid string

    // if result is null (i.e. user has not typed in the field, and there's no default port) do nothing
    if (!result) {
      return;
    }
    let response;
    response = result.name;
    // if (result.unlocode) { 
    //   response = `${result.name} (${result.unlocode})`;
    // } else if (result.name) {
    //   response = result.name;
    // } else { 
    //   response = result;
    // }

    return response;
  }

  return (
    <>
      <label htmlFor="autocomplete">Default value</label>
      <Autocomplete
        id="autocomplete"
        name="defaultValue"
        defaultValue={currentValue}
        showNoOptionsFound={false}
        source={suggest}
        templates={{
          inputValue: template,
          suggestion: template,
        }}
        onConfirm={(e) => handleOnConfirm(e)}
      />
    </>
  );
};

export default Sugggester;
