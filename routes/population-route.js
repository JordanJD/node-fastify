import { RedisWrapper } from "../lib/redis.js";
import { PopulationPutSchema } from "../lib/schemas.js";

const baseUrl = "/api/population/state/:state/city/:city";
const redis = await RedisWrapper.getInstance();

const PopulationRoute = async (fastify, options, done) => {
  fastify.get(baseUrl, options, async (request, response) => {
    try {
      const population = await redis.getPopulation({
        city: request.params.city,
        state: request.params.state,
      });
      response
        .status(200)
        .send({
          state: request.params.state,
          city: request.params.city,
          population,
        });
    } catch (error) {
      response.send(error);
    }
  });

  fastify.put(baseUrl, PopulationPutSchema, async (request, response) => {
    try {
      const status = await redis.setPopulation({
        city: request.params.city,
        state: request.params.state,
        population: request.body,
      });
      response.status(status).send();
    } catch (error) {
      response.send(error);
    }
  });

  done();
};

export default PopulationRoute;
