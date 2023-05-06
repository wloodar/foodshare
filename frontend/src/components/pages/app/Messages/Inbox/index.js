import React from 'react'
import { Helmet } from 'react-helmet';
import Main from './Logic';

export default function Inbox() {
  return (
    <>
        <Helmet>
            <title>Skrzynka wiadomości - FoodShare</title>
        </Helmet>
        <Main/>
    </>
  )
}