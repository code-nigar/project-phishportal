import React from 'react';
import axios from '../../node_modules/axios/index';
const https = require('https');
import { isJwtExpired } from 'jwt-check-expiration';
// const api = 'http://20.63.81.190:1338/';
// const goPhishApi = 'http://192.199.204.118:1338/';
// const api2 = 'http://172.168.10.55:1338/';
// const token = '5b9df0f4e8295a7ba7a9a6031fb9c503d018b51e41bc60fbca14f53f929c9afc';

const api = 'http://localhost:1338/'; //127.0.0.1
const goPhishApi = 'http://localhost:1338/'; //20.63.81.190:1338
const api2 = 'http://localhost:1338/';
import Swal from 'sweetalert2';

let token = '';

//var type;

const getToken = () => {
    let data = JSON.parse(localStorage.getItem('userdata'));
    token = data?.token;

    if (isJwtExpired(token) || !token) {
        localStorage.removeItem('userdata');
        window.location.replace('/login');
        return true;
    } else {
        return false;
    }
};

async function createUser(obj) {
    console.log(obj);
    return await axios.post(`${goPhishApi}createPortalUser`, { ...obj });
}
async function createPortalUser(userDetails) {
        return await axios.post(
            `${api}createPortalUser`,
            { ...userDetails },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
}
async function updatePortalUser(userDetails) {
    if (getToken() !== true) {
        return await axios.put(
            `${api}editPortalUser`,
            { ...userDetails },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }
}
async function editCost(userDetails) {
    if (getToken() !== true) {
        return await axios.put(
            `${api}editCost`,
            { ...userDetails },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }
}
async function changePassword(obj) {
    if (getToken() !== true) {
        return await axios.post(`${api2}changePassword`, obj, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}
async function getPortalUsers() {
    if (getToken() !== true) {
        return await axios.get(`${api}getPortalUsers`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}
async function getCost() {
    if (getToken() !== true) {
        return await axios.get(`${api}getCost`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}
async function getCampaignCostByName() {
    if (getToken() !== true) {
        return await axios.get(`${api}getCampaignCostByName`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}
async function billPaid(obj) {
    if (getToken() !== true) {
        return await axios.post(`${api}billPaid`, obj, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}
async function getCampaignCost(username) {
    if (getToken() !== true) {
        return await axios.get(`${api}getCampaignCost/${username}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}
async function deletePortalUser(email) {
    if (getToken() !== true) {
        return await axios.post(
            `${api}deletePortalUser`,
            {
                // id,
                // auth
                email
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }
}
async function createTemplate(obj) {
    console.log(obj);
    return await axios.post(`${goPhishApi}createTemplate`, { ...obj });
}
async function createGroup(obj) {
    console.log(obj);
    return await axios.post(`${goPhishApi}createGroup`, { ...obj });
}
async function createPage(obj) {
    console.log(obj);
    return await axios.post(`${goPhishApi}createPage`, { ...obj });
}
async function importSite(obj) {
    console.log(obj);
    return await axios.post(`${goPhishApi}importSite`, { ...obj });
}
async function importEmail(obj) {
    console.log(obj);
    return await axios.post(`${goPhishApi}importEmail`, { ...obj });
}
async function editPage(obj, i) {
    console.log(obj);
    return await axios.put(`${goPhishApi}editPage/${i}`, { ...obj });
}
async function editUser(obj, i) {
    console.log(obj);
    return await axios.put(`${goPhishApi}editUser/${i}`, { ...obj });
}
async function editSendingProfile(obj, i) {
    console.log(obj);
    return await axios.put(`${goPhishApi}editSendingProfile/${i}`, { ...obj });
}
async function editTemplate(obj, i) {
    console.log(obj);
    return await axios.put(`${goPhishApi}editTemplate/${i}`, { ...obj });
}
async function editGroup(obj, i) {
    console.log(obj);
    return await axios.put(`${goPhishApi}editGroup/${i}`, { ...obj });
}
async function createCompaign(obj) {
    console.log(obj);
    return await axios.post(`${goPhishApi}createCompaign`, { ...obj });
}
async function createSendingProfile(obj) {
    console.log(obj);
    return await axios.post(`${goPhishApi}createSendingProfile`, { ...obj });
}
async function deleteGroup(i, auth) {
    console.log(i, 'delete', auth);
    return await axios.post(`${goPhishApi}deleteGroup`, { i, auth });
}
async function deleteCompaign(id, auth) {
    return await axios.post(`${goPhishApi}deleteCompaign`, {
        id,
        auth
    });
}
//doing work
async function deleteTemplate(id, auth) {
    console.log(id);
    return await axios.post(`${goPhishApi}deleteTemplate`, {
        auth,
        id
    });
}
async function deletePage(id, auth) {
    console.log(id);
    return await axios.post(`${goPhishApi}deletePage`, {
        id,
        auth
    });
}
async function deleteSendingProfile(id, auth) {
    console.log(id);
    return await axios.post(`${goPhishApi}deleteSendingProfile`, {
        id,
        auth
    });
}
async function deleteUser(id) {
    console.log(id);
    return await axios.delete(`${goPhishApi}deleteUser/${id}`);
}
async function getUsers() {
    return await axios.get(`${goPhishApi}getUsers`);
}
//implementaiton of api based authentication
async function getGroups() {
    //console.log('api key gophish', JSON.parse(localStorage.getItem('userdata'))?.gophishkey);
    let gopkey = JSON.parse(localStorage.getItem('userdata'))?.gophishkey;
    if (gopkey !== null) {
        return await axios.post(`${goPhishApi}getGroups`, {
            Authorization: gopkey
        });
    } else {
        Swal.fire('Purchase Gophish Plan to access this module', 'warning');
    }
}
async function getGroupsSummary() {
    let gopkey = JSON.parse(localStorage.getItem('userdata'))?.gophishkey;
    if (gopkey !== null) {
        return await axios.post(`${goPhishApi}getGroupsSummary`, {
            Authorization: gopkey
        });
    } else {
        Swal.fire('Purchase Gophish Plan to access this module', 'warning');
    }
}
async function getTemplates() {
    let gopkey = JSON.parse(localStorage.getItem('userdata'))?.gophishkey;
    if (gopkey !== null) {
        return await axios.post(`${goPhishApi}getTemplates`, {
            Authorization: gopkey
        });
    } else {
        Swal.fire('Purchase Gophish Plan to access this module', 'warning');
    }
}
async function getPages() {
    let gopkey = JSON.parse(localStorage.getItem('userdata'))?.gophishkey;
    if (gopkey !== null) {
        return await axios.post(`${goPhishApi}getPages`, {
            Authorization: gopkey
        });
    } else {
        Swal.fire('Purchase Gophish Plan to access this module', 'warning');
    }
}
async function getSendingProfile() {
    let gopkey = JSON.parse(localStorage.getItem('userdata'))?.gophishkey;
    if (gopkey !== null) {
        return await axios.post(`${goPhishApi}getSendingProfile`, {
            Authorization: gopkey
        });
    } else {
        Swal.fire('Purchase Gophish Plan to access this module', 'warning');
    }
}
async function getCompaigns() {
    let gopkey = JSON.parse(localStorage.getItem('userdata'))?.gophishkey;
    if (gopkey !== null) {
        return await axios.post(`${goPhishApi}getCompaigns`, {
            Authorization: gopkey
        });
    } else {
        Swal.fire('Purchase Gophish Plan to access this module', 'warning');
    }
}
async function getCompaignResult(id) {
    let gopkey = JSON.parse(localStorage.getItem('userdata'))?.gophishkey;
    if (gopkey !== null) {
        return await axios.post(`${goPhishApi}getCompaignResult/${id}`, {
            Authorization: gopkey
        });
    } else {
        Swal.fire('Purchase Gophish Plan to access this module', 'warning');
    }
}
async function getAllCompaignResult(id) {
    let gopkey = JSON.parse(localStorage.getItem('userdata'))?.gophishkey;
    if (gopkey !== null) {
        return await axios.get(
            `https://127.0.0.1:3333/api/campaigns/${id}/results/?api_key=fc1ccdfd8859e182fdee0079cb6bfffef68d1df3d5b5fdda02cd280f41248151`,
            {
                Authorization: gopkey
            }
        );
    } else {
        Swal.fire('Purchase Gophish Plan to access this module', 'warning');
    }
}
async function getCompaignSummary(id) {
    let gopkey = JSON.parse(localStorage.getItem('userdata'))?.gophishkey;
    if (gopkey !== null) {
        return await axios.post(`${goPhishApi}getCompaignSummary/${id}`, {
            Authorization: gopkey
        });
    } else {
        Swal.fire('Purchase Gophish Plan to access this module', 'warning');
    }
}
async function getAllCampaignSummary() {
    let gopkey = JSON.parse(localStorage.getItem('userdata'))?.gophishkey;
    if (gopkey !== null) {
        return await axios.post(
            `https://127.0.0.1:3333/api/campaigns/summary/?api_key=fc1ccdfd8859e182fdee0079cb6bfffef68d1df3d5b5fdda02cd280f41248151`,
            {
                Authorization: gopkey
            }
        );
    } else {
        Swal.fire('Purchase Gophish Plan to access this module', 'warning');
    }
}
async function getCompleteCompaign(id) {
    let gopkey = JSON.parse(localStorage.getItem('userdata'))?.gophishkey;
    if (gopkey !== null) {
        return await axios.post(`${goPhishApi}getCompleteCompaign/${id}`, {
            Authorization: gopkey
        });
    } else {
        Swal.fire('Purchase Gophish Plan to access this module', 'warning');
    }
}
async function Login(username, password) {
    return await axios.post(`${api}cyberops_signin`, {
        username: username,
        password: password
    });
}

async function WazuhIntegration() {
    return await axios.post(`${api2}data`, {
        token: localStorage.getItem('siemToken')
    });
}

async function createCheckoutSession() {
    if (getToken() !== true) {
        return await axios.post(
            `${api}create-checkout-session`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }
}
async function createPaymentIntent() {
    if (getToken() !== true) {
        return await axios.get(
            `${api}create-payment-intent`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }
}
async function addStripeSecret(obj) {
    if (getToken() !== true) {
        return await axios.put(`${api}addStripeSecret`, obj, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}
async function getStripeSecret() {
    if (getToken() !== true) {
        return await axios.get(`${api}getStripeSecret`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}

export {
    WazuhIntegration,
    getAllCompaignResult,
    getAllCampaignSummary,
    changePassword,
    getCampaignCostByName,
    getCost,
    getCampaignCost,
    billPaid,
    editCost,
    importSite,
    importEmail,
    Login,
    editSendingProfile,
    editPage,
    editUser,
    editTemplate,
    editGroup,
    createUser,
    getUsers,
    createGroup,
    deleteGroup,
    getGroups,
    getGroupsSummary,
    createTemplate,
    getTemplates,
    createPage,
    getPages,
    createSendingProfile,
    getSendingProfile,
    getCompaigns,
    createCompaign,
    deleteCompaign,
    getCompaignResult,
    getCompaignSummary,
    getCompleteCompaign,
    deleteTemplate,
    deletePage,
    deleteSendingProfile,
    deleteUser,
    createPortalUser,
    getPortalUsers,
    deletePortalUser,
    createPaymentIntent,
    addStripeSecret,
    getStripeSecret,
    createCheckoutSession,
    updatePortalUser
};
