import React from 'react'
import { Helmet } from 'react-helmet';
import Main from './Logic';

export default function AddNewSchool() {
  return (
    <div className="dashboard">
        <Helmet>
            <title>Dodaj nową szkołe - FoodShare</title>
        </Helmet>
        <Main/>
    </div>
  )
}