import { Checkbox, Container, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { Layout } from 'components/document'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { FieldLabel, FormSection } from 'components/Settings'
import TagSEO from 'components/TagSEO'
import { useContext } from 'react'

const SubathonSettings = () => {
  const { subathonConfig, setSubathonConfig } = useContext(ConfigContext)

  const subathonForm = useForm({
    initialValues: {
      isSubathonActive: subathonConfig?.isSubathonActive,
      timeUnitBase: subathonConfig?.timeUnitBase,
    },
  })

  return (
    <Layout>
      <TagSEO />
      <Container size="sm" pt="lg">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSubathonConfig((prev) => ({
              ...prev,
              isSubathonActive: subathonForm.values.isSubathonActive,
              timeUnitBase: subathonForm.values.timeUnitBase,
            }))

            showNotification({
              title: 'Subathon Settings',
              message: 'Subathon settings have been saved',
              color: 'teal',
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

export default SubathonSettings
