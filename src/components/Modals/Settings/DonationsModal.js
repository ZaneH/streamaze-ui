import {
  Button,
  Checkbox,
  Divider,
  FileInput,
  Modal,
  PasswordInput,
  Select,
  TextInput,
  rem,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { IconFileMusic } from '@tabler/icons'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { LanyardContext } from 'components/Providers/LanyardProvider'
import { PhoenixContext } from 'components/Providers/PhoenixProvider'
import { FieldLabel, FormSection } from 'components/Settings'
import useElevenLabs from 'hooks/useElevenLabs'
import { useContext, useEffect } from 'react'
import wretch from 'wretch'
import FormDataAddon from 'wretch/addons/formData'

const DonationsModal = ({ isOpen, onClose }) => {
  const { slobsConfig, setSlobsConfig, userConfig } = useContext(ConfigContext)
  const { currentStreamer } = useContext(PhoenixContext)
  const { allVoices } = useElevenLabs(userConfig?.streamazeKey)
  const { kv, updateKV } = useContext(LanyardContext)
  const slobsForm = useForm({
    initialValues: {
      streamToken: slobsConfig.streamToken,
      ttsService: slobsConfig.ttsService,
      streamlabsVoice: slobsConfig?.streamlabsVoice,
      elevenlabsVoice: slobsConfig?.elevenlabsVoice,
      elevenlabsKey: slobsConfig?.elevenlabsKey,
      tiktokUsername: slobsConfig?.tiktokUsername,
      silentAudioInterval: slobsConfig?.silentAudioInterval,
      ttsDollarMin: slobsConfig?.ttsDollarMin,
      excludeFromProfits: slobsConfig?.excludeFromProfits,
      badWords: kv?.bad_words,
    },
  })

  useEffect(() => {
    slobsForm.setFieldValue('badWords', kv?.bad_words)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kv?.bad_words])

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      centered
      size="lg"
      withCloseButton={false}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setSlobsConfig((prev) => ({
            ...prev,
            streamToken: slobsForm.values.streamToken,
            ttsService: slobsForm.values.ttsService,
            streamlabsVoice: slobsForm.values.streamlabsVoice,
            elevenlabsVoice: slobsForm.values.elevenlabsVoice,
            elevenlabsKey: slobsForm.values.elevenlabsKey,
            tiktokUsername: slobsForm.values.tiktokUsername,
            silentAudioInterval: slobsForm.values.silentAudioInterval,
            ttsDollarMin: slobsForm.values.ttsDollarMin,
            excludeFromProfits: slobsForm.values.excludeFromProfits,
            badWords: slobsForm.values.badWords,
          }))

          wretch(
            `${process.env.REACT_APP_API_3_URL}/api/streamers/${currentStreamer.id}`
          )
            .patch({
              donations_config: {
                streamlabs_token: slobsForm.values.streamToken,
                tts_service: slobsForm.values.ttsService,
                streamlabs_voice: slobsForm.values.streamlabsVoice,
                elevenlabs_voice: slobsForm.values.elevenlabsVoice,
                elevenlabs_key: slobsForm.values.elevenlabsKey,
                tiktok_username: slobsForm.values.tiktokUsername,
                silent_audio_interval: slobsForm.values.silentAudioInterval,
                tts_dollar_min: slobsForm.values.ttsDollarMin,
                exclude_from_profits: slobsForm.values.excludeFromProfits,
              },
            })
            .res((res) => {
              if (res.ok) {
                updateKV('bad_words', slobsForm.values.badWords)

                showNotification({
                  title: 'Donation Settings saved!',
                  color: 'teal',
                })
              }
            })
            .catch(() => {
              showNotification({
                title: 'Error saving Donation Settings',
                color: 'red',
              })
            })
        }}
      >
        <FormSection
          title="Donation Settings"
          subtitle="See your YouTube and Twitch donations live!"
        >
          <PasswordInput
            label={<FieldLabel>Streamlabs Token</FieldLabel>}
            placeholder="eykdjbnn2mnzb.bemMNjgknwli..."
            defaultValue={slobsForm.values.streamToken}
            onChange={(e) => {
              slobsForm.setFieldValue('streamToken', e.target.value)
            }}
          />
          <TextInput
            label={<FieldLabel>TikTok Username</FieldLabel>}
            placeholder="john.smith"
            defaultValue={slobsForm.values.tiktokUsername}
            onChange={(e) => {
              slobsForm.setFieldValue('tiktokUsername', e.target.value)
            }}
          />
          <TextInput
            label={<FieldLabel>TTS Dollar Minimum</FieldLabel>}
            placeholder="1"
            defaultValue={slobsForm.values.ttsDollarMin}
            onChange={(e) => {
              slobsForm.setFieldValue('ttsDollarMin', e.target.value)
            }}
          />
          <TextInput
            label={<FieldLabel>Play Silent Audio (minutes)</FieldLabel>}
            placeholder="10 (leave blank to disable)"
            defaultValue={slobsForm.values.silentAudioInterval}
            onChange={(e) => {
              slobsForm.setFieldValue('silentAudioInterval', e.target.value)
            }}
          />
          <Divider />
          <TextInput
            label={<FieldLabel>Censored Words</FieldLabel>}
            defaultValue={slobsForm.values.badWords}
            placeholder="comma,separated,list,carefully spaced"
            onChange={(e) => {
              slobsForm.setFieldValue('badWords', e.target.value)
            }}
          />
          <Divider />
          <Select
            label={<FieldLabel>TTS Service</FieldLabel>}
            defaultValue={slobsForm.values.ttsService}
            value={slobsForm.values.ttsService}
            data={[
              { value: 'elevenlabs', label: 'ElevenLabs' },
              { value: 'streamlabs', label: 'Streamlabs' },
            ]}
            onChange={(e) => {
              slobsForm.setFieldValue('ttsService', e)
            }}
          />
          {slobsForm.values.ttsService === 'streamlabs' ? (
            <Select
              label={<FieldLabel>Streamlabs Voice</FieldLabel>}
              defaultValue={slobsForm.values.streamlabsVoice}
              value={slobsForm.values.streamlabsVoice}
              data={[
                // https://gist.github.com/idealwebsolutions/84dcb061baa427050672b9b41f900ce8?permalink_comment_id=3014186#gistcomment-3014186
                { value: 'Nicole', label: 'Nicole' },
                { value: 'Enrique', label: 'Enrique' },
                { value: 'Tatyana', label: 'Tatyana' },
                { value: 'Russell', label: 'Russell' },
                { value: 'Lotte', label: 'Lotte' },
                { value: 'Geraint', label: 'Geraint' },
                { value: 'Carmen', label: 'Carmen' },
                { value: 'Mads', label: 'Mads' },
                { value: 'Penelope', label: 'Penelope' },
                { value: 'Mia', label: 'Mia' },
                { value: 'Joanna', label: 'Joanna' },
                { value: 'Matthew', label: 'Matthew' },
                { value: 'Brian', label: 'Brian' },
                { value: 'Seoyeon', label: 'Seoyeon' },
                { value: 'Ruben', label: 'Ruben' },
                { value: 'Ricardo', label: 'Ricardo' },
                { value: 'Maxim', label: 'Maxim' },
                { value: 'Lea', label: 'Lea' },
                { value: 'Giorgio', label: 'Giorgio' },
                { value: 'Carla', label: 'Carla' },
                { value: 'Naja', label: 'Naja' },
                { value: 'Maja', label: 'Maja' },
                { value: 'Astrid', label: 'Astrid' },
                { value: 'Ivy', label: 'Ivy' },
                { value: 'Kimberly', label: 'Kimberly' },
                { value: 'Chantal', label: 'Chantal' },
                { value: 'Amy', label: 'Amy' },
                { value: 'Vicki', label: 'Vicki' },
                { value: 'Marlene', label: 'Marlene' },
                { value: 'Ewa', label: 'Ewa' },
                { value: 'Conchita', label: 'Conchita' },
                { value: 'Karl', label: 'Karl' },
                { value: 'Zeina', label: 'Zeina' },
                { value: 'Miguel', label: 'Miguel' },
                { value: 'Mathieu', label: 'Mathieu' },
                { value: 'Justin', label: 'Justin' },
                { value: 'Lucia', label: 'Lucia' },
                { value: 'Jacek', label: 'Jacek' },
                { value: 'Bianca', label: 'Bianca' },
                { value: 'Takumi', label: 'Takumi' },
                { value: 'Ines', label: 'Ines' },
                { value: 'Gwyneth', label: 'Gwyneth' },
                { value: 'Cristiano', label: 'Cristiano' },
                { value: 'Mizuki', label: 'Mizuki' },
                { value: 'Celine', label: 'Celine' },
                { value: 'Zhiyu', label: 'Zhiyu' },
                { value: 'Jan', label: 'Jan' },
                { value: 'Liv', label: 'Liv' },
                { value: 'Joey', label: 'Joey' },
                { value: 'Raveena', label: 'Raveena' },
                { value: 'Filiz', label: 'Filiz' },
                { value: 'Dora', label: 'Dora' },
                { value: 'Salli', label: 'Salli' },
                { value: 'Aditi', label: 'Aditi' },
                { value: 'Vitoria', label: 'Vitoria' },
                { value: 'Emma', label: 'Emma' },
                { value: 'Hans', label: 'Hans' },
                { value: 'Kendra', label: 'Kendra' },
              ]}
              onChange={(e) => {
                slobsForm.setFieldValue('streamlabsVoice', e)
              }}
            />
          ) : null}
          {slobsForm.values.ttsService === 'elevenlabs' ? (
            <>
              <Select
                label={<FieldLabel>ElevenLabs Voice</FieldLabel>}
                defaultValue={slobsForm.values.elevenlabsVoice}
                data={
                  allVoices?.map((voice) => ({
                    value: voice?.id,
                    label: voice?.name,
                  })) ?? []
                }
                onChange={(e) => {
                  slobsForm.setFieldValue('elevenlabsVoice', e)
                }}
              />
              <PasswordInput
                label={<FieldLabel>ElevenLabs API Key</FieldLabel>}
                defaultValue={slobsForm.values.elevenlabsKey}
                onChange={(e) => {
                  slobsForm.setFieldValue('elevenlabsKey', e.target.value)
                }}
              />
            </>
          ) : null}
          <Divider />
          <FileInput
            name="file"
            label={<FieldLabel>Alert Sound</FieldLabel>}
            placeholder="Upload MP3 file (10MB max)"
            accept="audio/mp3"
            icon={<IconFileMusic size={rem(14)} />}
            onChange={(f) => {
              const jsonResp = (json) => {
                if (json?.success) {
                  showNotification({
                    title: 'Success!',
                    message: 'Alert sound uploaded successfully.',
                    color: 'green',
                  })
                } else {
                  showNotification({
                    title: 'Error!',
                    message: 'Something went wrong.',
                    color: 'red',
                  })
                }
              }

              if (f) {
                wretch(
                  `${process.env.REACT_APP_API_3_URL}/api/upload/alert?api_key=${userConfig?.streamazeKey}`
                )
                  .addon(FormDataAddon)
                  .headers({
                    'Content-Type': 'multipart/form-data',
                  })
                  .formData({ file: f })
                  .post()
                  .json(jsonResp)
                  .catch(() => {
                    showNotification({
                      title: 'Error!',
                      message: 'Something went wrong.',
                      color: 'red',
                    })
                  })
              }
            }}
          />
          <Button
            variant="outline"
            color="red"
            w="min-content"
            onClick={() => {
              wretch(
                `${process.env.REACT_APP_API_3_URL}/api/upload/alert?api_key=${userConfig?.streamazeKey}`
              )
                .headers({
                  'Content-Type': 'multipart/form-data',
                })
                .post()
                .json((json) => {
                  if (json?.success) {
                    showNotification({
                      title: 'Success!',
                      message: 'Alert sound removed. Using default.',
                      color: 'green',
                    })
                  }
                })
                .catch(() => {
                  showNotification({
                    title: 'Error!',
                    message: 'Something went wrong.',
                    color: 'red',
                  })
                })
            }}
          >
            Reset to Default Sound
          </Button>
          <Divider />
          <Checkbox
            label="Don't add donations to profit"
            checked={slobsForm.values.excludeFromProfits}
            onChange={(e) => {
              slobsForm.setFieldValue('excludeFromProfits', e.target.checked)
            }}
          />
        </FormSection>
      </form>
    </Modal>
  )
}

export default DonationsModal
