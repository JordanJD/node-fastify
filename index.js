import PopulationRoute from "./routes/population-route.js";
import Fastify from "fastify";
const fastify = Fastify({
  logger: true,
});

const port = 5555;

const start = async () => {
  try {
    await fastify.register(PopulationRoute);
    fastify.setNotFoundHandler((request, response) => {
      response.code(404).type("application/json").send({ error: "Not found" });
    });
    await fastify.listen({ port });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
