import { Checkbox, Container, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { Layout } from 'components/document'
import { ProviderProvider } from 'components/Providers'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { PhoenixContext } from 'components/Providers/PhoenixProvider'
import { FieldLabel, FormSection } from 'components/Settings'
import TagSEO from 'components/TagSEO'
import { useContext } from 'react'

const ProvidersWrapper = () => {
  return (
    <ProviderProvider>
      <SubathonSettings />
    </ProviderProvider>
  )
}

const SubathonSettings = () => {
  const { subathonConfig, setSubathonConfig } = useContext(ConfigContext)
  const { streamerChannel } = useContext(PhoenixContext)

  const subathonForm = useForm({
    initialValues: {
      isSubathonActive: subathonConfig?.isSubathonActive,
      timeUnitBase: subathonConfig?.timeUnitBase,
    },
  })

  return (
    <Layout>
      <TagSEO title="Streamaze | Subathon Settings" />
      <Container size="sm" pt="lg">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSubathonConfig((prev) => ({
              ...prev,
              isSubathonActive: subathonForm.values.isSubathonActive,
              timeUnitBase: subathonForm.values.timeUnitBase,
            }))

            const resp = streamerChannel.push('update_subathon_settings', {
              is_subathon: subathonForm.values.isSubathonActive,
              subathon_minutes_per_dollar: subathonForm.values.timeUnitBase,
            })

            resp.receive('ok', () => {
              showNotification({
                title: 'Subathon Settings',
                message: 'Subathon settings have been saved',
                color: 'teal',
              })
            })

            resp.receive('error', () => {
              showNotification({
                title: 'Subathon Settings',
                message: 'Subathon settings could not be saved',
                color: 'red',
              })
            })
          }}
        >
          <FormSection
            title="Subathon Settings"
            subtitle="Stream until the clock stops! Donations and subs will add time to the clock."
          >
            <Checkbox
              label="Turn on Subathon"
              checked={subathonForm.values.isSubathonActive}
              onChange={(e) => {
                const checked = e.currentTarget.checked
                subathonForm.setFieldValue('isSubathonActive', checked)
              }}
            />
            <TextInput
              value={subathonForm.values.timeUnitBase}
              label={
                <FieldLabel>$1 will add this much time (in minutes)</FieldLabel>
              }
              placeholder="Minutes"
              onChange={(e) => {
                subathonForm.setFieldValue(
                  'timeUnitBase',
                  e.currentTarget.value
                )
              }}
            />
          </FormSection>
        </form>
      </Container>
    </Layout>
  )
}

export default ProvidersWrapper
