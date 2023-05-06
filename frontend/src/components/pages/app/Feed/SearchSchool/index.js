import React from 'react'
import { Helmet } from 'react-helmet';

import Main from './Logic';

export default function SearchSchool() {
  return (
    <div className="dashboard">
        <Helmet>
            <title>Wyszukaj swoją szkołe - ShareFood</title>
        </Helmet>
        <Main/>
    </div>
  )
}