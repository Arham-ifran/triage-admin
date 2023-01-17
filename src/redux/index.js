import { combineReducers } from 'redux'
import adminReducer from '../views/Admin/Admin.reducer'
import rolesReducer from '../views/AdminStaff/permissions/permissions.reducer'
import userReducer from 'views/Users/Users.reducer'
import errorReducer from './shared/error/error.reducer'
import emailReducer from '../views/EmailTemplates/EmailTemplates.reducer'
import settingsReducer from '.././views/Settings/settings.reducer'
import faqReducer from 'views/Faq/Faq.reducer'
import contactsReducer from 'views/Contacts/Contacts.reducer'
import DashboardReducer from 'views/Dashboard.reducer'
import ContentManagementReducer from 'views/ContentManagment/cms.reducer'
import NewsLetterReducer from 'views/Newsletter/newsletter.reducer'
import walletReducer from 'views/Wallets/Wallet.reducer'
import AccountTiersReducer from 'views/AccountTiers/AccountTiers.reducer'
import kycReducer from 'views/Users/kyc.reducer'
import CriteriaReducer from 'views/Criteria/Criteria.reducer'
import promoCodeReducer from "views/PromoCode/PromoCode.reducer"
import StakingReducer from 'views/Staking/Staking.reducer'
import HistoryReducer from 'views/History/History.reducer'
import RequestReducer from 'views/RequestManagment/request.reducer'
import wireRequestReducer from "views/WireTransferRequests/wireTransfer.reducer"

export default combineReducers({
    admin: adminReducer,
    role: rolesReducer,
    user: userReducer,
    error: errorReducer,
    email: emailReducer,
    settings: settingsReducer,
    faqs: faqReducer,
    wallets: walletReducer,
    contacts: contactsReducer,
    dashboard: DashboardReducer,
    content: ContentManagementReducer,
    newsletter: NewsLetterReducer,
    accountTiers: AccountTiersReducer,
    kyc: kycReducer,
    criteria: CriteriaReducer,
    promoCodes: promoCodeReducer,
    staking: StakingReducer,
    history: HistoryReducer,
    request: RequestReducer,
    wireRequest: wireRequestReducer
})