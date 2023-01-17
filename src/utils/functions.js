import { toast } from 'react-toastify';
import axios from "axios";
let baseUrl = process.env.REACT_APP_BASE_URL;

const placeholderImg = 'https://res.cloudinary.com/arhamsoft-ltd/image/upload/v1658297644/hex-nft/assets/placeholder_ogfxwf.png';

export const axiosUpsertData = (url, body, isMultipart = false, method = 'post') => {
  return new Promise((resolve, reject) => {
    const config = {
      headers: {
        'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
      },
    };

    url = baseUrl + url;

    axios[method](url, body, config).then(
      (res) => {
        const { data } = res
        if (data.success)
          toast.success(data.message)
        else
          toast.error(data.message)

        resolve(res.data)
      },
      (error) => {
        if (error.response && error.response.data) {
          const { data } = error.response
          if (data.message)
            toast.error(data.message)
        }
        resolve(error)
      },
    );
  });
};

export const axiosGetData = (url, qs = '') => {
  return new Promise((resolve, reject) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    url = baseUrl + url;

    // if (qs)
    // url += `?${qs}`

    axios.get(url, config).then(
      (res) => {
        const { data } = res
        if (data.success)
          toast.success(data.message)
        else
          toast.error(data.message)

        resolve(data.data)
      },
      (error) => {
        if (error.response && error.response.data) {
          const { data } = error.response
          if (data.message)
            toast.error(data.message)
        }

        resolve(error)
      },
    );
  });
};

export const axiosDeleteData = (url) => {
  return new Promise((resolve, reject) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    url = baseUrl + url;

    axios.delete(url, config).then(
      (res) => {
        const { data } = res
        if (data.success)
          toast.success(data.message)
        else
          toast.error(data.message)

        resolve(data)
      },
      (error) => {
        if (error.response && error.response.data) {
          const { data } = error.response
          if (data.message)
            toast.error(data.message)
        }

        resolve(error)
      },
    );
  });
};

export const ipfsToUrl = (str) => {
  if (!!str && typeof (str) === 'object') {
    return str
  }
  if (!str || str?.trim() === '') {
    return placeholderImg
  }
  if (str.includes('ipfs://')) {
    str = str.replace('ipfs://', '')
    return `https://ipfs.io/ipfs/${str}`
  }
  return str
}
export const permissionsForComponents = [
  /**  system permissions **/

  // dashboard
  { role: 'viewDashboard', component: 'Dashboard' },

  // permissions
  { role: 'viewRole', component: 'Permissions' },

  // staff's records
  { role: 'viewStaff', component: 'Staff' },

  // users records
  { role: 'viewUsers', component: 'Users' },

  // kycs
  { role: 'viewKyc', component: 'Kyc' },

  // AccountTier
  { role: 'viewAccountTier', component: 'AccountTiers' },

  // Criteria
  { role: 'viewCriteria', component: 'Criteria' },

  // PromoCodes
  { role: 'viewPromoCodes', component: 'PromoCodes' },

  // Staking
  { role: 'viewStaking', component: 'Staking' },

  // Receive Staking
  { role: 'viewReceiveStaking', component: 'ReceiveStaking' },

  // email-templates
  { role: 'viewEmailTemplates', component: 'Email Templates' },

  // FAQs / articles
  { role: 'viewFaqs', component: 'Faq' },

  // FaqCategories / articles
  { role: 'viewFaqCategories', component: 'FaqCategories' },

  // Wallet 
  { role: 'viewWallet', component: 'Wallet' },

  // history
  { role: 'viewHistory', component: 'History' },

  // manage request
  { role: 'viewRequestDeletion', component: 'RequestManagment' },

  // content
  { role: 'viewContent', component: 'Content Management' },

  // contact
  { role: 'viewContact', component: 'Contacts' },

  // newsletter
  { role: 'viewNewsLetter', component: 'NewsLetter' },

  // settings
  { role: 'viewSetting', component: 'Settings' },

]