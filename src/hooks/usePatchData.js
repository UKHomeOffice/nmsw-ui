import axios from 'axios';
import Auth from '../utils/Auth';

const usePatchData = ({ url, dataToSubmit, pageSource }) => {
  const source = pageSource || location.pathname.substring(1);
  const data = axios.patch(url, dataToSubmit, {
    headers: { Authorization: `Bearer ${Auth.retrieveToken()}` },
  })
    .then((resp) => { return resp; })
    .catch((err) => {
      if (err.response) {
        switch (err.response.status) {
          case 401: window.location.assign(`/sign-in?source=${source}`); break;
          default: return ({ errors: true, status: err.response.status, message: err.response.data.message });
        }
      }
    });
  return data;
};

export default usePatchData;
