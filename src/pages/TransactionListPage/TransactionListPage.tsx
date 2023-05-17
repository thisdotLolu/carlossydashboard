import React from 'react'
import TransactionList from '../../components/TransactionList';
import './TransactionListPage.css'

const TransactionListPage = () => {
  return (
    <div className='transactions_page'>
        <p className='welcomeText'>Welcome back</p>
        <div className="dashboard-card">
							<div className="card-header"
              style={{color:"#46403B"}}
              >
								Transactions List
							</div>
							<TransactionList/>
			</div>
    </div>
  )
}

export default TransactionListPage;