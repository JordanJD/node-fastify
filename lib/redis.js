import { createClient } from 'redis';
import { createHash } from 'crypto';

export class RedisWrapper {

    static async getInstance() {
        if(!this.instance) {
            this.instance = new RedisWrapper();
        }
        return this.instance;
    }

    async getClient() {
        if(!this.client) {
            this.client = await createClient({legacyMode: false})
            .on('error', err => console.log('Redis Client Error', err))
            .connect();
        }
        return this.client;
    }

    async getPopulation({city, state}) {
        const key = this.createHashKey({city, state});
        const client =  await this.getClient();
        console.log({key, client});
        const population = await client.get(key);
        console.log({population});
        return population;
    }

    async setPopulation({city,state,population}) {
        const key = this.createHashKey({city, state});
        const client =  await this.getClient();
        await client.set(key, population);
    }

    createHashKey({city,state}) {
        return createHash('sha256').update(`${city.toLowerCase()}-${state.toLowerCase()}`).digest('hex');
    }
 }
