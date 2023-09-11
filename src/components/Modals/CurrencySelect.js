import { Select } from '@mantine/core'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { useContext } from 'react'

const CurrencySelect = () => {
  const {
    setCurrencyConfig,
    currencyConfig = {
      currency: 'usd',
    },
  } = useContext(ConfigContext)

  return (
    <Select
      withinPortal
      label="Choose Currency"
      value={currencyConfig?.currency}
      onChange={(value) => {
        setCurrencyConfig({
          ...currencyConfig,
          currency: value,
        })
      }}
      data={[
        { label: 'New Zealand Dollar ($)', value: 'nzd' },
        { label: 'Japanese Yen (¥)', value: 'jpy' },
        { label: 'South Korean Won (₩)', value: 'krw' },
        { label: 'Nepalese Rupee (रू)', value: 'npr' },
        { label: 'Indian Rupee (₹)', value: 'inr' },
        { label: 'Hong Kong Dollar (HKD)', value: 'hkd' },
        { label: 'Philippine Peso (₱)', value: 'php' },
        { label: 'Thai Baht (฿)', value: 'thb' },
        { label: 'US Dollar ($)', value: 'usd' },
      ]}
    />
  )
}

export default CurrencySelect
