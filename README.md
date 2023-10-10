# Description

A simple node, redis, and fastify server. The setup will install required modules, and migrate will populate the Redis db for the API to work.

# Setup

1. Run `npm install`
2. Run `npm run start`
3. Run `npm run migrate`

# API

#### GET `/api/population/state/:state/city/:city`

#### PUT `/api/population/state/:state/city/:city`

## TODOs

- Setup Jest testing
- Setup automated endpoint tests and benchmarks
- Write some code comments / documentation
