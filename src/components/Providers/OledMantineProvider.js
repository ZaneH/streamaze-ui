const { MantineProvider } = require('@mantine/core')
const { useContext } = require('react')
const { ConfigContext } = require('./ConfigProvider')

const OledMantineProvider = ({ children }) => {
  const { themeConfig } = useContext(ConfigContext)
  const darkColorValues =
    themeConfig?.theme === 'oled'
      ? {
          // OLED
          dark: [
            '#bfbfbe',
            '#000000',
            '#bfbfbe',
            '#000000',
            '#444444',
            '#000000',
            '#000000',
            '#000000',
            '#000000',
            '#000000',
          ],
        }
      : {
          // Dark mode
          dark: [
            '#C1C2C5',
            '#A6A7AB',
            '#909296',
            '#5C5F66',
            '#373A40',
            '#2C2E33',
            '#1A1B1E',
            '#0A0A0B',
            '#020100',
            '#101113',
          ],
        }

  return (
    <MantineProvider
      withNormalizeCSS
      withGlobalStyles
      theme={{
        colorScheme: 'dark',
        colors: darkColorValues,
        white: '#FDFFFC',
      }}
    >
      {children}
    </MantineProvider>
  )
}

export default OledMantineProvider
