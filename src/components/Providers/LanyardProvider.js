import { showNotification } from '@mantine/notifications'
import { createContext, useContext, useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import { ConfigContext } from './ConfigProvider'
export const LanyardContext = createContext()

const { REACT_APP_API_2_WS_URL } = process.env

const LanyardProvider = ({ children }) => {
  return null
}

export default LanyardProvider
