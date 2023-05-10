import { createContext, useContext, useEffect } from 'react'
import { ConfigContext } from './ConfigProvider'
export const GpsContext = createContext()

const gpsOptions = {
  enableHighAccuracy: true,
  timeout: 6000,
  maximumAge: 0,
}

const { REACT_APP_LANYARD_API_ENDPOINT } = process.env

function cloneAsObject(obj) {
  if (obj === null || !(obj instanceof Object)) {
    return obj
  }
  var temp = obj instanceof Array ? [] : {}
  // ReSharper disable once MissingHasOwnPropertyInForeach
  for (var key in obj) {
    temp[key] = cloneAsObject(obj[key])
  }
  return temp
}

const GpsProvider = ({ children }) => {
  const { lanyardConfig } = useContext(ConfigContext)

  useEffect(() => {
    if (!navigator.geolocation) return

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        if (!lanyardConfig?.discordUserId) return

        await fetch(
          `${REACT_APP_LANYARD_API_ENDPOINT}/${lanyardConfig?.discordUserId}/kv/gps`,
          {
            headers: {
              authorization: lanyardConfig?.apiKey,
            },
            method: 'PUT',
            body: JSON.stringify({
              coords: cloneAsObject(position.coords),
              last_updated_at: new Date().toISOString(),
            }),
          }
        )
      },
      (error) => console.error(error),
      gpsOptions
    )

    return () => navigator.geolocation.clearWatch(watchId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <GpsContext.Provider value={{}}>{children}</GpsContext.Provider>
}

export default GpsProvider
