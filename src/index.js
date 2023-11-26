/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import { hop } from '@onehop/client'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import 'typeface-roboto'

hop.init({
  projectId: process.env.REACT_APP_OBS_HOP_PROJECT_ID,
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
