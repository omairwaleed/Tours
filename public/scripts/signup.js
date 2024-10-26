import { showAlert } from './alert';
import axios from 'axios';
export const signup = async (email, password, name) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/users/signup`,
      data: JSON.stringify({
        email,
        password,
        name,
        passwordConfirm: password,
      }),
      headers: {
        'content-type': 'application/json',
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'added successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', 'error in adding user ');
    // alert(error);
  }
};
