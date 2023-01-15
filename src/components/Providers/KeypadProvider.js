import { useContext, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ConfigContext } from './ConfigProvider'

const KeypadProvider = ({ children }) => {
  const { keypadConfig } = useContext(ConfigContext)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (keypadConfig?.code !== '2486' && pathname !== '/keypad') {
      navigate('/keypad', {
        replace: true,
      })
    } else if (keypadConfig?.code === '2486' && pathname === '/keypad') {
      navigate('/')
    }
  }, [navigate, keypadConfig?.code, pathname])

  return children
}

export default KeypadProvider
