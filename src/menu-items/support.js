// assets
import { ChromeOutlined, QuestionOutlined } from '@ant-design/icons';
import ReportIcon from '@mui/icons-material/Report';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import PersonIcon from '@mui/icons-material/Person';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import BugReportIcon from '@mui/icons-material/BugReport';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import ForumIcon from '@mui/icons-material/Forum';
import SettingsIcon from '@mui/icons-material/Settings';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import DataSaverOffIcon from '@mui/icons-material/DataSaverOff';
// icons
const icons = {
    ChromeOutlined,
    QuestionOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const support = {
    id: 'support',
    title: 'SIEM Management',
    type: 'group',
    children: [
        {
            id: 'SIEM-page',
            title: 'SIEM',
            type: 'item',
            url: '/siem',
            icon: DataSaverOffIcon,
            color: '#ffffff'
        }
    ]
};

export default support;
