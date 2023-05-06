import React from 'react'
import { Helmet } from 'react-helmet';
import Main from './Logic';

export default function MainShares() {
  return (
    <div className="dashboard">
        <Helmet>
            <title>Oferty podzielenia się - ShareFood</title>
        </Helmet>
        <Main/>
    </div>
  )
}