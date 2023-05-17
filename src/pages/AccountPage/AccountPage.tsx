import React, { useContext, useEffect, useState } from "react"
import Card, { CardBody, CardTitle } from "../../components/Card"
import Form from "../../components/Form"
import FormInput from "../../components/FormInput"
import Page from "../../components/Page"
import { AlertContext } from "../../context/AlertContext"
import { AuthContext } from "../../context/AuthContext"
import { Component } from "../../types/Util"
import { errorToString, getCountryCodeFromDialCode, getDialCodeFromCountryCode, pick, splitPhoneNumber, useEditUserRequest, userUpdateSchema, useSendVerificationEmailRequest, walletAddressSchema } from "../../util"

import * as Yup from "yup"

import "./AccountPage.css"

import EmailIcon from "../../svg/icons/email-outline.svg"
import NameIcon from "../../svg/icons/account-circle-outline.svg"
import Input from "../../components/Input"
import NationalityInput from "../../components/NationalityInput"
import Button from "../../components/Button"
import PhoneInput from "../../components/PhoneInput"
import {useForm,Controller,SubmitHandler} from 'react-hook-form';

import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import VerifiedIcon from "../../svg/icons/verified.svg"
import UnverifiedIcon from "../../svg/icons/unverified.svg"
import WalletIcon from "../../svg/icons/payments.svg"
import { ProjectContext } from "../../context/ProjectContext"
import { Loadable, Loader } from "../../components/Loader"
import { Link } from "react-router-dom"

const AccountPage: Component = () => {
	
	return (
		<Page path="/account" userRestricted>
			<div className="account-page">
				<p className="welcomeText">Welcome Back</p>
				
				<div>
					<div className="your_profile_text">Your profile</div>
					<div className="tab_profile">
					<a>
					<Link to='/account'>
						Personal Data
					</Link>	
					</a>
					<a>
						<Link to='/settings'>
						Settings
						</Link>
						
					</a>
				</div>
				</div>
				
				<div className="gap-wrapper gap-4 !m-0">
					<ProfileCard />
					{/* <WalletCard /> */}
				</div>
			</div>
		</Page>
	)
}

// export const WalletCard: Component = () => {
// 	const [ changed, setChanged ] = useState(false)
// 	const authContext = useContext(AuthContext)
// 	const alertContext = useContext(AlertContext)

// 	const { currentProject, currProjectRequest } = useContext(ProjectContext)

// 	const editUserRequest = useEditUserRequest()

// 	const initialValues = {
// 		wallet: authContext.user?.wallet || ""
// 	}

// 	const onSubmit = (values: any) => {
// 		if (!authContext.user) return;
// 		editUserRequest.sendRequest(authContext.user?.id, {wallet: values.wallet})
// 			.then(() => alertContext.addAlert({type: "success", label: "Successfully saved wallet address"}))
// 			.catch((err) => alertContext.addAlert({type: "error", label: errorToString(err, "Error saving wallet address")}))
// 	}

// 	return (
// 		<Card className="wallet-card">
// 			<CardTitle>
// 				Wallet Address
// 			</CardTitle>
// 			<CardBody className="flex flex-col">
// 				<Loader loading={currProjectRequest.fetching}>
// 					<Loadable component="p" className="mb-2">
// 						Make sure you use an <span className="font-semibold">{currentProject?.wallet?.type}</span> wallet address.
// 					</Loadable>
// 				</Loader>
// 				<Form
// 					initialValues={initialValues}
// 					validationSchema={Yup.object().shape({wallet: walletAddressSchema})}
// 					onSubmit={onSubmit}
// 					onUpdate={() => !changed && setChanged(true)}
// 				>
// 					<FormInput
// 						field="wallet"
// 						icon={WalletIcon}
// 						placeholder="Wallet Address"
// 						autoCapitalize="off"
// 					/>
// 					<Button
// 						color="primary"
// 						className="mt-4"
// 						disabled={!changed || currProjectRequest.fetching}
// 						loading={editUserRequest.fetching}
// 					>
// 						Save Changes
// 					</Button>
// 				</Form>
// 			</CardBody>
// 		</Card>
// 	)
// }


export const ProfileCard: Component = () => {
	const authContext = useContext(AuthContext)
	const alertContext = useContext(AlertContext)
	const [ changed, setChanged ] = useState(false)

	const editUserRequest = useEditUserRequest()

	const phoneNumberSplit = splitPhoneNumber(authContext.user?.mobile || "")

	const initialValues = {
		...pick(authContext.user || {}, [
			"first_name",
			"last_name",
			"nationality",
		]),
		phone_number: phoneNumberSplit.number,
		country_code: getCountryCodeFromDialCode(phoneNumberSplit.dial_code)
	}

	const onSubmit = (values: Record<string, any>) => {
		if (!authContext.user) return;
		
		const dialCode = getDialCodeFromCountryCode(values.country_code)
		const mobile = `${dialCode} ${values.phone_number}`
		
		editUserRequest.sendRequest(authContext.user.id, {
			first_name: values.first_name,
			last_name: values.last_name,
			nationality: values.nationality,
			mobile
		})
			.then((res) => {
				authContext.updateUser(res.data)
				alertContext.addAlert({
					type: "success", label: "Successfully updated user"
				})
				setChanged(false)
			})
			.catch((err) => {
				alertContext.addAlert({
					type: "error", label: errorToString(err, "Error updating user")
				})
			})
	}

	const sendVerificationEmailRequest = useSendVerificationEmailRequest()
	
	const [ timeLeft, setTimeLeft ] = useState(0)

	const [startDate, setDate] = useState(new Date)
	const defaultEndDate = new Date()
	defaultEndDate.setDate(defaultEndDate.getDate() + 7)

	 const today = new Date()
	const selectDateHandler = (d:any) => {
    setDate(d)
  }


	useEffect(() => {
		if (!sendVerificationEmailRequest.fetchedAt) return;
		setTimeLeft(60)
		let interval = setInterval(() => {
			if (timeLeft - 1 === 0) clearInterval(interval)
			setTimeLeft((timeLeft) => Math.max(timeLeft - 1, 0))
		}, 1000)
		return () => clearInterval(interval)
	}, [sendVerificationEmailRequest.fetchedAt])


	return (
		<div>
			<div className="profile_page_tab">
			<Card className="profile-card">
			<CardTitle>
				Edit your personal Data
			</CardTitle>
			<CardBody className="flex flex-col">
				<Form
					initialValues={initialValues}
					validationSchema={userUpdateSchema}
					onSubmit={onSubmit}
					onUpdate={() => !changed && setChanged(true)}
				>
					<FormInput
						field="first_name"
						icon={NameIcon}
						placeholder="First Name"
						autoComplete="given-name"
						autoCapitalize="words"
					/>
					<FormInput
						field="last_name"
						icon={NameIcon}
						placeholder="Last Name"
						autoComplete="family-name"
						autoCapitalize="words"
					/>
					<Input
						disabled
						icon={EmailIcon}
						value={authContext.user?.email}
						placeholder="Email"
						autoCapitalize="off"
						autoComplete="email"
					/>
					{/* <Input
						disabled
						icon={authContext.user?.is_email_verified === false ? UnverifiedIcon : VerifiedIcon}
						value={authContext.user?.is_email_verified === false ? "Email not verified" : "Email is verified"}
						placeholder="Verified"
						autoCapitalize="off"
						autoComplete="email"
					/> */}
					<PhoneInput
						numberField="phone_number"
						codeField="country_code"
					/>
					<div
		className="nationality_profile"
		>
			<p>Nationality</p>
			<NationalityInput 
			field="nationality" />
		</div>

					<Button
						color="primary"
						className="mt-4"
						disabled={!changed}
						loading={editUserRequest.fetching}
					>
						Update Profile
					</Button>
				</Form>
				{/* {authContext.user?.is_email_verified === false && (
					<Button
						color="primary"
						buttonStyle="outlined"
						className="mt-4"
						loading={sendVerificationEmailRequest.fetching}
						disabled={timeLeft > 0}
						onClick={
							() => sendVerificationEmailRequest.sendRequest()
								.then(() => alertContext.addAlert({type: "success", label: "Successfully sent verification email"}))
								.catch((err) => alertContext.addAlert({type: "error", label: errorToString(err, "Error sending verification email")}))
						}
					>
						Resend Verification Email{timeLeft > 0 && ` (${timeLeft})`}
					</Button>
				)}
				<Button
					color="primary"
					buttonStyle="outlined"
					className="mt-4"
					onClick={() => authContext.logout()}
				>
					Logout
				</Button> */}
			</CardBody>
			<div>
			</div>
		</Card>
		<div className="column_2_profile">
			<p style={{marginTop:'90px'}}>Date of birth</p>
		<DatePicker
        dateFormat="yyyy/MM/dd"
        selected={startDate}
        onChange={selectDateHandler} 
		showYearDropdown
		scrollableMonthYearDropdown
		className='date_picker'
        todayButton={"Today"}/>
		
		<div className="Account_Status">
			<p style={{color:'#582900'}}>Account Status</p>
			<p style={{color:'#582900',fontWeight:'600',marginTop:'3px'}}><img src='/imagesCarlossy/verified.png'/>Account Verified</p>
			<Button
						color="primary"
						className="mt-4"
						disabled={true}
						loading={editUserRequest.fetching}
					>
						Resend Email
					</Button>
		</div>
		</div>
		</div>
		<div className="dashboardBottom_carlossy">
				<p >We support a wide range of crypto</p>
				<div className="images_bottom">
				<img src='/imagesCarlossy/1.png'/>
				<img src='/imagesCarlossy/2.png'/>
				<img src='/imagesCarlossy/3.png'/>
				<img src='/imagesCarlossy/4.png'/>
				<img src='/imagesCarlossy/5.png'/>
				<img src='/imagesCarlossy/6.png'/>
				<img src='/imagesCarlossy/7.png'/>
				<img src='/imagesCarlossy/8.png'/>
				<img src='/imagesCarlossy/9.png'/>
				<img src='/imagesCarlossy/10.png'/>
				<img src='/imagesCarlossy/11.png'/>
				<img src='/imagesCarlossy/12.png'/>
				<img src='/imagesCarlossy/13.png'/>
				<img src='/imagesCarlossy/14.png'/>
				<img src='/imagesCarlossy/15.png'/>
				<img src='/imagesCarlossy/16.png'/>
				<img src='/imagesCarlossy/17.png'/>
				</div>
				
			</div>
		</div>
			
	)
}

export default AccountPage