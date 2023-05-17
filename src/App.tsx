import { BrowserRouter, Routes, Route } from "react-router-dom"
import BuyPage from "./components/BuyPage"
import ForgotPasswordPage from "./components/ForgotPasswordPage"
import Layout from "./components/Layout"
import ReferralsPage from "./components/ReferralsPage"
import ResetPasswordPage from "./components/ResetPasswordPage"
import { GlobalContextWrapper } from "./context/GlobalContext"
import AccountPage from "./pages/AccountPage"
import './App.css';

import DashboardPage from "./pages/DashboardPage"
import LoginPage from "./pages/LoginPage"
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage"
import RegisterPage from "./pages/RegisterPage"
import TermsConditionsPage from "./pages/TermsConditionsPage"
import VerifyEmailPage from "./pages/VerifyEmailPage"
import PromotionsPage from "./pages/PromotionsPage"
import TransactionListPage from "./pages/TransactionListPage/TransactionListPage"
import SettingsPage from "./pages/SettingsPage/SettingsPage"
import ReferringPage from "./pages/ReferringPage/ReferringPage"

const App = () => {
	return (
		<BrowserRouter>
			<GlobalContextWrapper>
				<Layout>
					<Routes>
						<Route path="/" element={<DashboardPage />} />
						<Route path="/login" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} />
						<Route path="/forgot-password" element={<ForgotPasswordPage />} />
						<Route path="/reset-password" element={<ResetPasswordPage />} />
						<Route path="/verify-email" element={<VerifyEmailPage />} />
						<Route path="/account" element={<AccountPage />} />
						<Route path="/buy" element={<BuyPage />} />
						<Route path="/transactions" element={<TransactionListPage/>} />
						<Route path='/settings' element={<SettingsPage/>}/>
						<Route path="/promotions" element={<PromotionsPage />} />
						<Route path="/referrals" element={<ReferralsPage />} />
						<Route path="/referralsinfo" element={<ReferringPage />} />
						<Route path="/terms" element={<TermsConditionsPage />} />
						<Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
					</Routes>
				</Layout>
			</GlobalContextWrapper>
		</BrowserRouter>
	)
}

export default App
