# Streamaze UI – Dashboard

## Depends On

- [ZaneH/streamaze-donation-service](https://github.com/ZaneH/streamaze-donation-service)
- [ZaneH/streamaze-api](https://github.com/ZaneH/streamaze-api)
- [ZaneH/exchange-rate-api](https://github.com/ZaneH/exchange-rate-api)

## Preview

View the landing page for a full overview here: https://streamaze.xyz/landing

Or maybe checkout the guide here: https://guide.streamaze.xyz

<img width="1075" alt="image" src="https://github.com/ZaneH/streamaze-ui/assets/8400251/d0d455c3-f39b-41c7-9cf6-dd2eeec181d1">

## Setup

```bash
$ git clone https://github.com/ZaneH/streamaze-ui.git
$ cd streamaze-ui
$ npm install
$ npm start
```

## Environment Variables

```
# .env.local
REACT_APP_API_2_WS_URL=ws://localhost:8080/ws # streamaze-donation-service API (WS)
REACT_APP_API_2_URL=http://localhost:8080 # streamaze-donation-service API
REACT_APP_API_3_URL=http://localhost:4000 # Phoenix API URL
REACT_APP_API_3_WS_URL=ws://localhost:4000/socket # Phoenix socket URL
REACT_APP_OBS_HOP_PROJECT_ID=<obs project id for stream info>
REACT_APP_EXCHANGE_RATE_API_URL= # run this locally: https://github.com/ZaneH/exchange-rate-api
REACT_APP_MAILCHIMP_URL=<mailchimp url for landing page> # not required
```
