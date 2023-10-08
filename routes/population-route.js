const baseUrl = '/api/population/state/:state/city/:city';
import { RedisWrapper } from '../lib/redis.js';
const redis = await RedisWrapper.getInstance();

const PopulationRoute = async (fastify, options, done) => {
    fastify.get(baseUrl, options, async (request, response) => {
        console.log('getting population');
        const pop = await redis.getPopulation({city:request.params.city, state:request.params.state });
        console.log({pop});
        response.send({ state: request.params.state, pop });
    });

    done();
}

export default PopulationRoute;