import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Flex,
  Text,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useReadChannelState } from '@onehop/react'
import { IconAdjustmentsHorizontal } from '@tabler/icons'
import { useContext, useState } from 'react'
import SceneSwitcher from './SceneSwitcher'
import { SidebarContext } from './SidebarProvider'

const OBSCard = () => {
  const { obsConfig, setObsConfig } = useContext(SidebarContext)
  const { state, error } = useReadChannelState(obsConfig?.connectionId)
  const [isEditing, setIsEditing] = useState(false)
  const serverState = state?.server?.state ?? 'error'
  const isLive = state?.stream_live === true
  const isError = error || serverState === 'error'
  const scenes = state?.server?.scenes ?? []
  const activeScene = state?.server?.active_scene ?? ''

  const form = useForm({
    initialValues: Object.assign({}, obsConfig),
  })

  return (
    <Card shadow="xs" p="lg" radius="md" h="min-content">
      <Flex align="center" justify="space-between" mb="md">
        <Text>
          OBS Dashboard <b>(Not Finished)</b>
        </Text>
        <Flex gap="xs" align="center">
          {!isEditing && (
            <>
              <Badge color={isLive ? 'green' : 'red'}>
                {isLive ? 'Live' : 'Offline'}
              </Badge>
              <Badge color={serverState === 'ready' ? 'green' : 'orange'}>
                {serverState}
              </Badge>

              <ActionIcon
                onClick={() => {
                  setIsEditing(true)
                }}
              >
                <IconAdjustmentsHorizontal size={18} />
              </ActionIcon>
            </>
          )}
        </Flex>
      </Flex>
      {isEditing && (
        <form
          onSubmit={(e) => {
            e.preventDefault()

            setObsConfig(form.values)
            setIsEditing(false)
          }}
        >
          <TextInput
            defaultValue={form?.values?.connectionId}
            label="Connection ID"
            placeholder="example:name"
            onChange={(e) => {
              form.setFieldValue('connectionId', e.target.value)
            }}
          />
          <Button.Group mt="md">
            <Button
              fullWidth
              color="red"
              variant="outline"
              onClick={() => {
                form.setValues(Object.assign({}, obsConfig))
                setIsEditing(false)
              }}
            >
              Cancel
            </Button>
            <Button fullWidth type="submit">
              Save
            </Button>
          </Button.Group>
        </form>
      )}
      {!isEditing && !isError && (
        <SceneSwitcher scenes={scenes} activeScene={activeScene} />
      )}
      {!isEditing && isError && !state && (
        <Text size="sm" color="red">
          There was an issue connecting to OBS. Check your connection ID and
          reload the page.
        </Text>
      )}
    </Card>
  )
}

export default OBSCard
