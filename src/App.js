import { Notifications } from '@mantine/notifications'
import Countdown from 'pages/Countdown'
import Landing from 'pages/Landing'
import PollWidget from 'pages/PollWidget'
import SlotMachine from 'pages/SlotMachine'
import SubathonSettings from 'pages/SubathonSettings'
import SubscriberCountWidget from 'pages/SubscriberCountWidget'
import TickerWidget from 'pages/TickerWidget'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ChatLog } from './components/Chat'
import { ConfigProvider, OledMantineProvider } from './components/Providers'
import SidebarProvider from './components/Providers/SidebarProvider'
import GoLive from './pages/GoLive'
import Home from './pages/Home'
import Keypad from './pages/Keypad'
import RaspberryPi from './pages/RaspberryPi'
import ServerControl from './pages/ServerControl'
import Settings from './pages/Settings'
import MazeWidget from 'pages/MazeWidget'

const App = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ConfigProvider>
          <OledMantineProvider>
            <Notifications />
            <SidebarProvider>
              <Routes>
                <Route path="/landing" element={<Landing />} />

                <Route path="/" element={<Navigate to="/dashboard" />} />

                <Route path="/settings" element={<Settings />} />

                <Route path="/dashboard" element={<Home />} />

                <Route path="/go-live" element={<GoLive />} />
                <Route path="/server" element={<ServerControl />} />

                <Route
                  path="/chat"
                  element={
                    <ChatLog
                      height="100%"
                      fluid
                      showProfilePicture={false}
                      autorefresh={20 * 60 * 1000}
                    />
                  }
                />

                <Route path="/keypad" element={<Keypad />} />

                <Route path="/raspberrypi" element={<RaspberryPi />} />

                <Route path="/subathon/clock" element={<Countdown />} />
                <Route path="/subathon" element={<SubathonSettings />} />

                <Route path="/poll/:id" element={<PollWidget />} />

                <Route path="/widget/ticker/:id" element={<TickerWidget />} />

                <Route
                  path="/widget/subs/:platform"
                  element={<SubscriberCountWidget />}
                />

                <Route path="/widget/maze/:id" element={<MazeWidget />} />

                <Route path="/giveaway/slots" element={<SlotMachine />} />

                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </SidebarProvider>
          </OledMantineProvider>
        </ConfigProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
