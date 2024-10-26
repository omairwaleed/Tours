import axios from 'axios';
import { showAlert } from './alert';

export const updateData = async (data, type) => {
  document.querySelector('.btn--save-password').textContent = 'Updating..';
  try {
    const res = await axios({
      method: 'Patch',
      url:
        type === 'password'
          ? '/api/v1/users/updatePassword'
          : '/api/v1/users/updateMe',
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'data updated');
      location.reload(true);
    }
  } catch (error) {
    showAlert('error', error.messagae);
  }
  document.querySelector('.btn--save-password').textContent = 'Save password';
};
