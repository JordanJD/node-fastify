const baseUrl = '/api/population/state/:state/city/:city';
import { RedisWrapper } from '../lib/redis.js';
const redis = await RedisWrapper.getInstance();

const PopulationRoute = async (fastify, options, done) => {
    fastify.get(baseUrl, options, async (request, response) => {
        try {
            const population = await redis.getPopulation({city:request.params.city, state:request.params.state });
            response.status(200).send({ state: request.params.state, city: request.params.city, population });
        } catch(error) {
            response.send(error);
        }
    });

    done();
}

export default PopulationRoute;