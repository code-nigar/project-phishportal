// project import
import pages from './pages';
import dashboard from './dashboard';
import support from './support';
import utilities from './utilities';
import phishing from './phishing';

//have to add support page for SIEM after its integration
// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
    items: [phishing, utilities]
};
//utilities support
JSON.parse(localStorage.getItem('userdata'))?.type === 'SuperUser' && menuItems.items.unshift(pages);
export default menuItems;
