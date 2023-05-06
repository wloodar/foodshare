import React from 'react'
import { Helmet } from 'react-helmet';

import AccountLayout from '../Layout';
import Logic from './Logic';

export default function Dashboard() {
  return (
    <AccountLayout><Logic/></AccountLayout>
  )
}