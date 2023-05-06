import React from 'react'
import { Helmet } from 'react-helmet';

import Aside from './Aside';

export default ({ children }) => {
  return (  
    // <div className="ac-wrap ac-wrap--global-w ac-wrap--nav-margin">
    //     <Aside/>
    //     <div className="ac-content">
    //         { children }
    //     </div>
    // </div>
    <div className="ac-wrap ac-wrap--global-w">
        <Aside/>
        <div className="ac-content">
            { children }
        </div>
    </div>
  )
}