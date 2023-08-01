# Streamaze UI

## Quick Start

### Environment Variables

```
# .env.local
# Lots of these API URL are not needed anymore
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_WS_URL=ws://localhost:8000
REACT_APP_API_2_WS_URL=ws://localhost:8080/ws
REACT_APP_API_2_URL=http://localhost:8080
REACT_APP_API_3_URL=http://localhost:4000
REACT_APP_API_3_WS_URL=ws://localhost:4000/socket
REACT_APP_OBS_HOP_PROJECT_ID=<obs project id for stream info>
REACT_APP_SAM_SOCKET_TOKEN_ALIAS=<alias for sam's socket token (set in donation-service)> # probably not needed
REACT_APP_SAM_LANYARD_API_KEY=<sam's lanyard api key> # probably not needed
REACT_APP_SAM_DISCORD_ID=<sam's discord id> # probably not needed
REACT_APP_EXCHANGE_RATE_API_URL=https://exrate-api.streamaze.live
REACT_APP_MAILCHIMP_URL=<mailchimp url for landing page> # not needed
```

### Run Locally
```bash
$ git clone git@github.com:Streamaze/streamaze-ui.git
$ cd streamaze-ui
$ npm install
$ npm start
```
