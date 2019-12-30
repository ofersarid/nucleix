import { send as sendEmail } from 'emailjs-com';

const CONFIG = {
  SERVICE_ID: 'rechter_studio',
  USER_ID: 'user_G5XidPOIQwVxbe1dVDS1Q',
  TEMPLATE: 'uppercase_lead',
};

const send = (name, email, phone) => {
  return sendEmail(CONFIG.SERVICE_ID, CONFIG.TEMPLATE, {
    'email': email,
    'name': name,
    'phone': phone.toString()
  }, CONFIG.USER_ID);
};

export default {
  send
};
