import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/Button'
import Toggle from '../../components/Toggle/Toggle'
import './SettingsPage.css'



const SettingsPage = () => {
  return (
    <div className='settings_page_container'>
		<p className='welcomeText'>Welcome back</p>
		<div className='settings_page'>
        <div>
				<p className="welcomeText">Your Profile</p>
				<div className="tab_profile tab_profile_settings">
					<a>
					<Link to='/account'
					>Personal Data</Link>
					</a>
					<a>
					<Link to='/settings'>
						Settings
					</Link>
					</a>
				</div>
		</div>
		<div className='password_sections'>
			<div className='password_section_settings'>
            <p style={{fontWeight:'600',color:'#582900',marginTop:'10px'}}>Change Password</p>
			<div className='password_section_inner'>
			<div className='old_password'>
				<p>Enter Old Password</p>
			<div className='input_password'>
			<img src='/imagesCarlossy/padlock.png'/>
			<input type="text" 
			placeholder='Create a Strong Password'
			/>
			<img src='/imagesCarlossy/eye.png'/>
			</div>
			</div>

			<div className='new_password'>	
				<p>Enter New Password</p>
				<div className='input_password'>
					<img src='/imagesCarlossy/padlock.png'/>
					<input
					type='text'
					placeholder='Create Strong Password'
					/>
					<img src='/imagesCarlossy/eye.png'/>
				</div>
			</div>

			<div className='confirm_password'>	
				<p>Confirm New Password</p>
				<div className='input_password'>
					<img src='/imagesCarlossy/padlock.png'/>
					<input
					type='text'
					placeholder='Create Strong Password'
					/>
					<img src='/imagesCarlossy/eye.png'/>
				</div>
			</div>
			</div>	
			<div>
				Password should be a minimum of 6 digits and include lower and uppercase letter. Your password will only change after your confirmation by email.
			</div>
			<Button
				color="primary"
				className="mt-4"
			>
				Update
			</Button>
        </div>
		<div className='divider_settings'></div>
		<div className='password_section_2'>
			<p
			style={{fontWeight:'600',color:'#582900',marginTop:'10px',marginBottom:'20px'}}
			>Two Factor Authentication</p>

		<div className='two_factor_auth'>
			<p style={{color:'#757575',fontSize:'0.9rem'}}>Two-factor authentication is a method of protection of your account. When it is activated, you are required to enter not only your password , but also a special code. You can receieve the code in mobile app. Even if a third party individual gains access to your password, they still won't be able to access your account without the 2FA code.</p>
			<div className='enable_2fa'>
				<button>Enable 2FA</button>
				<div>
					Current Status
					<div className='disabled'>
						<h1 style={{color:'red'}}>Disabled</h1><span><img src='/imagesCarlossy/disabled.png'/></span>
					</div>
				</div>
			</div>
			<hr style={{backgroundColor:'#582900',marginBottom:'20px'}}/>
			<p>Other Settings</p>
			<div className='acts_log'>
				<p>See my activities log</p><Toggle rounded={true}/>
			</div>
			<div className='acts_log'>
				<p className='alert_email'>Alert me by email in case of unusual activity in my account</p>
				<Toggle rounded/>
			</div>
		</div>
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



export default SettingsPage