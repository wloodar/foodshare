import React from 'react'
import { Helmet } from 'react-helmet';
import Main from './Logic';

export default function Conversation() {
  return (
    <>
        <Helmet>
            <title>Konwersacja - FoodShare</title>
        </Helmet>
        <Main/>
    </>
  )
}