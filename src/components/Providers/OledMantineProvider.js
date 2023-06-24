const { MantineProvider } = require('@mantine/core')
const { useContext } = require('react')
const { ConfigContext } = require('./ConfigProvider')

const OledMantineProvider = ({ children }) => {
  const { themeConfig } = useContext(ConfigContext)
  const darkColorValues =
    themeConfig?.theme === 'oled'
      ? {
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
      : {}

  return (
    <MantineProvider
      withNormalizeCSS
      withGlobalStyles
      theme={{
        colorScheme: 'dark',
        colors: darkColorValues,
      }}
    >
      {children}
    </MantineProvider>
  )
}

export default OledMantineProvider
