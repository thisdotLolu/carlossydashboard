import type { Component } from "../../types/Util"
import { Link, useNavigate } from "react-router-dom"

import FormPage from "../../components/FormPage"
import Page from "../../components/Page"

import Button from "../../components/Button"

import "./RegisterPage.css"

import EmailIcon from "../../svg/icons/email-outline.svg"

import Shoppingbasket from '../../../public/imagescarlossy/shopping-basket.svg'
import PasswordIcon from '../../svg/icons/lock.svg'
import PromoCart from "../../../public/imagescarlossy/Add-Person.svg"
import NameIcon from "../../svg/icons/account-circle-outline.svg"

import { useRegisterRequest, UserArgs, registerSchema, pick, getDialCodeFromCountryCode, errorToString, dollarItem, useSendVerificationEmailRequest } from "../../util"
import NationalityInput from "../../components/NationalityInput"
import Form, { FormRender } from "../../components/Form"
import FormInput from "../../components/FormInput"

import { AuthContext } from "../../context/AuthContext"
import { AlertContext } from "../../context/AlertContext"
import PhoneInput from "../../components/PhoneInput"
import { useContext, useEffect, useState } from "react"
import FormCheckbox from "../../components/FormCheckbox"
import FormNumberInput from "../../components/FormNumberInput"
import { SelectModalWrapper } from "../../components/SelectModal"
import TokenSelectModal, { FormTokenSelectModal, TokenSelectItem } from "../../components/TokenSelectModal"

import _DropdownIcon from "../../svg/icons/down-chevron.svg"
import { CurrencyItemDisplay } from "../../components/BuyPage"
import { StageContext } from "../../context/StageContext"
import clsx from "clsx"
import TieredBonusButtons from "../../components/TieredBonusButtons"
import { Loader } from "../../components/Loader"
import { ProjectContext } from "../../context/ProjectContext"

const DropdownIcon = _DropdownIcon as unknown as Component<any>

const RegisterPage: Component = () => {
	const navigate = useNavigate()
	const authContext = useContext(AuthContext)
	const alertContext = useContext(AlertContext)
	const { activeStage, activeStageRequest } = useContext(StageContext)
	const { currencyTokenList, currProjectRequest } = useContext(ProjectContext)
	const sendVerificationEmailRequest = useSendVerificationEmailRequest()

	const registerRequest = useRegisterRequest()

	const [ tokenModalOpen, setTokenModalOpen ] = useState(false)

	const initialValues = {
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		nationality: "",
		phone_number: "",
		country_code: "GB",
		terms_accepted: false,
		token: currencyTokenList?.[0],
		usd_amount: 0
	}

	const [ values, setValues ] = useState(initialValues)
	

	//confirm if password is same
	// const confirmPassword=()=>{
	// 	let password1= 
	// }


	useEffect(() => {
		if (values.token !== undefined) return;
		updateValue("token", currencyTokenList?.[0])
	}, [values?.token, currencyTokenList])

	const onSubmit = (vals: Record<string, any>) => {
		const dialCode = getDialCodeFromCountryCode(vals.country_code)
		let mobile: string | undefined = `${dialCode} ${vals.phone_number}`
		if (!vals.phone_number) mobile = undefined;

		let args: UserArgs = {
			...pick(vals, ["first_name", "last_name", "email", "nationality", "password"]),
			mobile
		} as UserArgs

		const params = new URLSearchParams(location.search)
		let referral = params.get("referral")
		if (referral) {
			args.referrals = {
				referred_by: referral
			}
		}

		registerRequest.sendRequest(args).then((res) => {
			authContext.login(res.data.user, res.data.tokens)
			navigate(`/buy?usd_amount=${vals.usd_amount}&token_id=${vals.token.id}`, {replace: true})
			alertContext.addAlert({
				type: "success",
				label: "Successfully registered"
			})
			sendVerificationEmailRequest.sendRequest()
				.then(() => {
					alertContext.addAlert({
						type: "success",
						label: "Successfully sent verification email"
					})
				})
				.catch((err) => {
					alertContext.addAlert({
						type: "error",
						label: errorToString(err, "Error sending verification email")
					})
				})

			
		}).catch((err) => {
			alertContext.addAlert({
				type: "error",
				label: errorToString(err, "Error while registering")
			})
		})
	}

	const updateValue = (key: string, value: any) => {
		setValues((val) => {
			let newValues = {...val, [key]: value}
			return newValues
		})
	}


	return (
		<Page path="/register" title="Register" onlyLoggedOut>
			<div 
			style={{zIndex:'2'}}
			className="page_top_carlossy">
				<img src='/imagescarlossy/Logo.png'/>
				<h1 className="grobold"
				style={{color:'#582900'}}
				>Register For Presale</h1>
			</div>
			<Form
				className="register-page flex-1"
				initialValues={initialValues}
				onSubmit={onSubmit}
				validationSchema={registerSchema}
				values={values}
				onUpdate={(newVals) => setValues(newVals as unknown as typeof values)}
			>
				<FormPage
					title="Personal Details"
					background={"/imagescarlossy/BackgroundImage.svg"}
					classes={{body: "flex flex-col flex-gap-y-4", wrapper: "relative"}}
					outsideElement={(
						<SelectModalWrapper open={tokenModalOpen}>
							<FormTokenSelectModal
								field="token"
								open={tokenModalOpen}
								onClose={() => setTokenModalOpen(false)}
								bonuses={activeStage?.bonuses.payment_tokens}
							/>
						</SelectModalWrapper>
					)}
				>
					<div className="flex flex-gap-x-2">
						<FormInput
							field="first_name"
							icon={NameIcon}
							placeholder="First Name"
							autoComplete="given-name"
							autoCapitalize="words"
							className="flex-[1.3]"
						/>
						<FormInput
							field="last_name"
							placeholder="Last Name"
							autoComplete="family-name"
							autoCapitalize="words"
							className="flex-1"
						/>
					</div>
					<FormInput
						field="email"
						icon={EmailIcon}
						placeholder="Email"
						autoComplete="email"
						autoCapitalize="off"
					/>
					<FormInput
						field="password"
						icon={PasswordIcon}
						placeholder="Password"
						autoCapitalize="off"
						visibilityToggle
					/>
					{/* <FormInput
					    
						field="confirm password"
						icon={PasswordIcon}
						placeholder="Confirm Password"
						autoCapitalize="off"
						visibilityToggle
					/> */}
					<NationalityInput field="nationality" />
					<PhoneInput
						numberField="phone_number"
						codeField="country_code"
					/>
					<Loader loading={activeStageRequest.fetching || currProjectRequest.fetching}>
						<div className="flex flex-col flex-gap-y-4">
							<h2 className="text-lg" style={{textAlign:'center',marginTop:'40px'}}>Purchase Details</h2>
							<div className="flex flex-col">
								{/* <TieredBonusButtons
									bonuses={activeStage?.bonuses.tiered_fiat || []}
									onSelect={(item) => updateValue("usd_amount", item.amount)}
									usdAmount={values.usd_amount}
								/> */}
								<p>Enter purchase amount in USD</p>
								<FormNumberInput
									field="usd_amount"
									placeholder="$ Amount"
									autoCapitalize="off"
									rightContent={<CurrencyItemDisplay className="w-auto" currencyItem={dollarItem} />}
								/>
								
							</div>
							
							<p style={{marginBottom:'1px'}}>Select preferred Token for payment</p>
							<CurrencyItemDisplay
							style={{backgroundColor:"white",color:'#7D7975'}}
								component={Button}
								className="py-3 !justify-start w-full group"
								color="bg-contrast"
								type="button"
								onClick={() => setTokenModalOpen(true)}
								currencyItem={values.token}
								bonuses={activeStage?.bonuses.payment_tokens}
								classes={{bonusChip: "bg-background-paperLight group-hover:bg-background-paperHighlight transition-background-color"}}
							>
								<DropdownIcon 
								style={{color:'#7D7975'}}
								className="h-3 w-3 ml-auto text-action-unselected group-hover:text-text-primary transition-color" />
							</CurrencyItemDisplay>
							
						</div>

						<p style={{marginBottom:'0px'}}>Enter Promo Code if any</p>
						<FormInput
						field="Promo Code"
						icon={Shoppingbasket}
						placeholder="Promo Code"
						autoCapitalize="off"
						visibilityToggle
					/>
					    <p style={{marginBottom:'0px'}}>Enter the referral code of your inviter</p>
						<FormInput
						field="Referral Code"
						icon={PromoCart}
						placeholder="Referral Code"
						autoCapitalize="off"
						visibilityToggle
					/>
						<div className="flex items-center">
							<FormCheckbox
								field="terms_accepted"
								className="inline-block"
							/>
							<span className="ml-3">I agree to the Terms and Conditions and Privacy Policy</span>
						</div>
						<div className="login-footer flex-gap-y-4 flex flex-col mt-2 <xs:mt-2">
							<Button color="primary" loading={registerRequest.fetching}>
								Create Account
							</Button>
							<span className="text-center">
								Already have account? <Link to="/login" style={{color:'#BBA796',fontSize:"1.5rem"}}>Sign in</Link>
							</span>
						</div>
					</Loader>
				</FormPage>
			</Form>
		</Page>
	)
}

export default RegisterPage