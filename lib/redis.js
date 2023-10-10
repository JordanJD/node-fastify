import { createClient } from "redis";
import { createHash } from "crypto";

export class RedisWrapper {
  static async getInstance() {
    if (!this.instance) {
      this.instance = new RedisWrapper();
    }
    return this.instance;
  }

  async getClient() {
    if (!this.client) {
      this.client = await createClient({ legacyMode: false })
        .on("error", (err) => console.log("Redis Client Error", err))
        .connect();
    }
    return this.client;
  }

  async getPopulation({ city, state }) {
    const key = this.createHashKey({ city, state });
    const client = await this.getClient();
    const population = await client.get(key);
    if (!population) {
      const error = new Error(
        `no population found for city: ${city} and state: ${state}`
      );
      error.statusCode = 400;
      throw error;
    }
    return population;
  }

  async setPopulation({ city, state, population }) {
    const key = this.createHashKey({ city, state });
    const client = await this.getClient();

    try {
      const exists = await client.get(key);
      await client.set(key, population);
      if (exists) {
        return 200;
      } else {
        return 201;
      }
    } catch (e) {
      const error = new Error(e);
      error.statusCode = 400;
      throw error;
    }
  }

  createHashKey({ city, state }) {
    return createHash("sha256")
      .update(`${city.toLowerCase()}-${state.toLowerCase()}`)
      .digest("hex");
  }
}
