//importing layouts....
import Admin from 'layouts/Admin';
import UnAuth from 'layouts/Auth';

import Dashboard from "views/Dashboard.js";
import Login from "./views/Login/Login";
import Users from "./views/Users/Users"
import SiteSettings from "views/Settings/SiteSettings";
import SocialSettings from "views/Settings/SocialSettings";
import Faq from "views/Faq/Faq";
import AddFaq from "views/Faq/AddFaq"
import EditFaq from 'views/Faq/EditFaq';
import EmailTemplates from "views/EmailTemplates/EmailTemplates";
import Profile from 'views/Profile/profile'
import Unauth from 'layouts/Auth';
import EmailTemplate from 'views/EmailTemplates/EmailTemplate';
import ForgotPassword from 'views/ForgotPassword/ForgotPassword';
import ResetPassword from 'views/ResetPassword/ResetPassword';
import Contacts from 'views/Contacts/Contacts';
import Permissions from 'views/AdminStaff/permissions/permissionsListingComponent'
import Staff from 'views/AdminStaff/staff/staffListingComponent'
import contentManagementSystem from 'views/ContentManagment/contentManagementSystem';
import RequestManagment from 'views/RequestManagment/requestManagment'
import UpsertContent from 'views/ContentManagment/upsertContent'
import ViewCMS from 'views/ContentManagment/viewCMS';
import NewsLetter from 'views/Newsletter/Newsletter'
import Wallet from "views/Wallets/Wallet";
import AddWallet from "views/Wallets/AddWallet"
import EditWallet from 'views/Wallets/EditWallet';
import ViewWallet from 'views/Wallets/ViewWallet';
import AccountTiers from 'views/AccountTiers/AccountTiers';
import UpsertAccountTiers from 'views/AccountTiers/UpsertAccountTiers';
import User from 'views/Users/User';
import FaqCategories from 'views/Faq/FaqCategories';
import UpsertFaqCategory from 'views/Faq/UpsertFaqCategory';
import Criteria from 'views/Criteria/Criteria';
import UpsertCriteria from 'views/Criteria/UpsertCriteria';
import PromoCodes from "views/PromoCode/PromoCodes";
import AddPromoCode from "views/PromoCode/AddPromoCode";
import EditPromoCode from "views/PromoCode/EditPromoCode";
import ViewPromoCode from "views/PromoCode/ViewPromoCode";
import Staking from "views/Staking/Staking";
import ReceiveStaking from 'views/Staking/ReceiveStaking';
import Kyc from 'views/Users/Kyc';
import History from 'views/History/History';
import BankDetails from "views/Settings/BankDetails";
import WireTransferRequests from "views/WireTransferRequests/wireTransfer";
import EditWireRequest from "views/WireTransferRequests/viewWireRequest"
import withdrawRequests from 'views/WireTransferRequests/withdrawRequests';


var routes = [
  {
    path: "/",
    layout: Unauth,
    name: "Login",
    icon: "nc-icon nc-chart-pie-35",
    access: true,
    exact: true,
    component: Login
  },
  {
    path: "/dashboard",
    layout: Admin,
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    access: true,
    exact: true,
    component: Dashboard,
    showInSideBar: true
  },
  {
    path: "/profile",
    layout: Admin,
    name: "Profile",
    icon: "nc-icon nc-circle-09",
    access: true, exact: true,
    component: Profile,
    showInSideBar: false,
  },
  {
    collapse: true,
    name: "Admin Staff",
    state: "openAdminStaff",
    icon: "nc-icon nc-grid-45",
    showInSideBar: true,
    submenus: [
      {
        path: "/permissions",
        layout: Admin,
        name: "Permissions",
        icon: "nc-icon nc-grid-45",
        access: true, exact: true,
        component: Permissions,
        showInSideBar: true,
      },
      {
        path: "/staff",
        layout: Admin,
        name: "Staff",
        icon: "nc-icon nc-grid-45",
        access: true, exact: true,
        component: Staff,
        showInSideBar: true,
      }
    ],
  },
  {
    path: "/users",
    layout: Admin,
    name: "Users",
    icon: "nc-icon nc-single-02",
    access: true, exact: true,
    component: Users,
    showInSideBar: true,
  },
  {
    path: "/kyc",
    layout: Admin,
    name: "KYC",
    icon: "nc-icon nc-satisfied",
    access: true, exact: true,
    component: Kyc,
    showInSideBar: true,
  },
  {
    path: "/user/:userId",
    layout: Admin,
    name: "Users",
    icon: "nc-icon nc-single-02",
    access: true, exact: true,
    component: User,
    showInSideBar: false,
  },
  {
    collapse: true,
    name: "Account Levels",
    state: "openAccountStaff",
    icon: "nc-icon nc-single-copy-04",
    showInSideBar: true,
    submenus: [
      {
        path: "/account-tiers",
        layout: Admin,
        name: "Account Tiers",
        icon: "nc-icon nc-single-copy-04",
        access: true, exact: true,
        component: AccountTiers,
        showInSideBar: true,
      },
      {
        path: "/criteria",
        layout: Admin,
        name: "Criteria",
        icon: "nc-icon nc-grid-45",
        access: true, exact: true,
        component: Criteria,
        showInSideBar: true,
      }
    ],
  },
  {
    collapse: true,
    name: "Request Management",
    state: "openRequests",
    icon: "nc-icon nc-bulb-63",
    showInSideBar: true,
    submenus: [
      {
        path: "/request",
        layout: Admin,
        name: "Account Deletion Requests",
        icon: "nc-icon nc-single-copy-04",
        access: true, exact: true,
        component: RequestManagment,
        showInSideBar: true,
      },
      {
        path: "/wiretransfer-requests",
        layout: Admin,
        name: "Wire Transfer Requests",
        icon: "nc-icon nc-refresh-02",
        access: true, exact: true,
        component: WireTransferRequests,
        showInSideBar: true,
      },
      {
        path: "/withdraw-requests",
        layout: Admin,
        name: "Withdraw Requests",
        icon: "nc-icon nc-money-coins",
        access: true, exact: true,
        component: withdrawRequests,
        showInSideBar: true,
      },
    ],
  },
  {
    path: "/add-criteria",
    layout: Admin,
    name: "Account Tiers",
    icon: "nc-icon nc-single-copy-04",
    access: true, exact: true,
    component: UpsertCriteria,
    showInSideBar: false,
  },
  {
    path: "/edit-criteria/:id",
    layout: Admin,
    name: "Account Tiers",
    icon: "nc-icon nc-single-copy-04",
    access: true, exact: true,
    component: UpsertCriteria,
    showInSideBar: false,
  },
  {
    path: "/view-criteria/:id",
    layout: Admin,
    name: "Account Tiers",
    icon: "nc-icon nc-single-copy-04",
    access: true, exact: true,
    component: UpsertCriteria,
    showInSideBar: false,
  },
  {
    path: "/add-account-tier",
    layout: Admin,
    name: "Account Tiers",
    icon: "nc-icon nc-single-copy-04",
    access: true, exact: true,
    component: UpsertAccountTiers,
    showInSideBar: false,
  },
  {
    path: "/edit-account-tier/:id",
    layout: Admin,
    name: "Account Tiers",
    icon: "nc-icon nc-single-copy-04",
    access: true, exact: true,
    component: UpsertAccountTiers,
    showInSideBar: false,
  },
  {
    path: "/promo-codes",
    layout: Admin,
    name: "Promo Codes",
    icon: "nc-icon nc-email-83",
    access: true, exact: true,
    component: PromoCodes,
    showInSideBar: true,
  },
  {
    path: "/staking",
    layout: Admin,
    name: "Staking",
    icon: "nc-icon nc-layers-3",
    access: true, exact: true,
    component: Staking,
    showInSideBar: true,
  },
  // {
  //   path: "/receive-staking",
  //   layout: Admin,
  //   name: "Receive Staking",
  //   icon: "nc-icon nc-delivery-fast",
  //   access: true, exact: true,
  //   component: ReceiveStaking,
  //   showInSideBar: true,
  // },

  {
    path: "/request/:requestId",
    layout: Admin,
    name: "WireRequest",
    icon: "nc-icon nc-single-02",
    access: true, exact: true,
    component: EditWireRequest,
    showInSideBar: false,
  },
  {
    path: "/add-promocode",
    layout: Admin,
    name: "Add Promo Code",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: AddPromoCode,
  },
  {
    path: "/edit-promocode/:promoCodeId",
    layout: Admin,
    name: "Add Promo Code",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: EditPromoCode,
  },
  {
    path: "/view-promocode/:promoCodeId",
    layout: Admin,
    name: "Add Promo Code",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: ViewPromoCode,
  },
  {
    path: "/email-templates",
    layout: Admin,
    name: "Email Templates",
    icon: "nc-icon nc-email-83",
    access: true, exact: true,
    component: EmailTemplates,
    showInSideBar: true,
  },
  {
    path: "/email-template/:emailId",
    layout: Admin,
    name: "Email Template",
    icon: "nc-icon nc-cart-simple",
    access: true, exact: true,
    component: EmailTemplate,
  },
  {
    path: "/add-email-template",
    layout: Admin,
    name: "Email Template",
    icon: "nc-icon nc-cart-simple",
    access: true, exact: true,
    component: EmailTemplate,
  },
  {
    collapse: true,
    name: "FAQS",
    state: "openFaqs",
    icon: "nc-icon nc-bulb-63",
    showInSideBar: true,
    submenus: [
      {
        path: "/faq-categories",
        layout: Admin,
        name: "Faq Categories",
        icon: "nc-icon nc-bullet-list-67",
        access: true, exact: true,
        component: FaqCategories,
        showInSideBar: true,
      },
      {
        path: "/faqs",
        layout: Admin,
        name: "Faqs",
        icon: "nc-icon nc-single-copy-04",
        access: true, exact: true,
        component: Faq,
        showInSideBar: true,
      }
    ],
  },
  {
    path: "/add-faq-category",
    layout: Admin,
    name: "Add Faq",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: UpsertFaqCategory,
  },
  {
    path: "/edit-faq-category/:faqCatId",
    layout: Admin,
    name: "Add Faq",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: UpsertFaqCategory,
  },
  {
    path: "/add-faq",
    layout: Admin,
    name: "Add Faq",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: AddFaq,
  },
  {
    path: "/edit-faq/:faqId",
    layout: Admin,
    name: "Edit Faq",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: EditFaq,
  },
  {
    path: "/wallet",
    layout: Admin,
    name: "Wallets",
    icon: "nc-icon nc-bag",
    access: true, exact: true,
    component: Wallet,
    showInSideBar: true,
  },
  {
    path: "/add-wallet",
    layout: Admin,
    name: "Add Wallet",
    icon: "nc-icon nc-bag",
    access: true, exact: true,
    component: AddWallet,
  },
  {
    path: "/edit-wallet/:walletId",
    layout: Admin,
    name: "Edit Wallet",
    icon: "nc-icon nc-bag",
    access: true, exact: true,
    component: EditWallet,
  },
  {
    path: "/view-wallet/:walletId",
    layout: Admin,
    name: "View Wallet",
    icon: "nc-icon nc-bag",
    access: true, exact: true,
    component: ViewWallet,
  },
  {
    path: "/history",
    layout: Admin,
    name: "History",
    icon: "nc-icon nc-single-copy-04",
    access: true, exact: true,
    component: History,
    showInSideBar: true,
  },

  {
    path: "/cms",
    layout: Admin,
    name: "CMS",
    icon: "nc-icon nc-single-copy-04",
    access: true, exact: true,
    component: contentManagementSystem,
    showInSideBar: true,
  },
  {
    path: "/add-cms",
    layout: Admin,
    name: "Add Content",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: UpsertContent,
  },
  {
    path: "/edit-cms/:contentId",
    layout: Admin,
    name: "Add Content",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: UpsertContent,
  },
  {
    path: "/view-cms/:contentId",
    layout: Admin,
    name: "Add Content",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: ViewCMS,
  },
  // {
  //   path: "/edit-cms/:contentId",
  //   layout: Admin,
  //   name: "Edit Content",
  //   icon: "nc-icon nc-bulb-63",
  //   access: true, exact: true,
  //   component: AddContentPage,
  // },
  {
    path: "/contact",
    layout: Admin,
    name: "Contacts",
    icon: "nc-icon nc-send",
    access: true, exact: true,
    component: Contacts,
    showInSideBar: true,
  },
  {
    path: "/newsletter",
    layout: Admin,
    name: "Newsletters",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: NewsLetter,
    showInSideBar: true,
  },
  {
    collapse: true,
    name: "Settings",
    state: "opensettings",
    icon: "nc-icon nc-settings-gear-64",
    showInSideBar: true,
    submenus: [
      {
        path: "/site-settings",
        layout: Admin,
        name: "Site Settings",
        mini: "SS",
        icon: "nc-icon nc-settings-gear-64",
        access: true, exact: true,
        component: SiteSettings,
        showInSideBar: true,
      },
      {
        path: "/social-settings",
        layout: Admin,
        name: "Social Settings",
        mini: "SS",
        icon: "nc-icon nc-settings-gear-64",
        access: true, exact: true,
        component: SocialSettings,
        showInSideBar: true,
      },
      {
        path: "/bank-details",
        layout: Admin,
        name: "Bank Details",
        mini: "BD",
        icon: "nc-icon nc-settings-gear-64",
        access: true, exact: true,
        component: BankDetails,
        showInSideBar: true,
      }
    ],
  },
  {
    path: "/login",
    layout: UnAuth,
    name: "Login",
    mini: "LP",
    component: Login,
  },
  {
    path: "/forgot-password",
    layout: UnAuth,
    name: "Forgot Passowrd",
    mini: "FP",
    component: ForgotPassword,
  },
  {
    path: "/reset-password/:adminId",
    layout: UnAuth,
    name: "Reset Passowrd",
    mini: "RP",
    component: ResetPassword,
  }
];

export default routes;
