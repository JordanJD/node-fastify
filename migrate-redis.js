import { createClient } from "redis";
import { readFileSync } from "fs";
import { createHash } from "crypto";

const client = await createClient({ legacyMode: false })
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();
const dataIsPopulated = await client.get("dataIsPopulated");
if (!dataIsPopulated) {
  const dataFileLines = JSON.stringify(
    readFileSync("./city_populations.csv").toString()
  ).split("\\r\\n");

  for (const line of dataFileLines) {
    const [city, state, population] = line.split(",");
    if (city && state && population) {
      const key = createHash("sha256")
        .update(`${city.toLowerCase()}-${state.toLowerCase()}`)
        .digest("hex");
      await client.set(key, population);
    }
  }

  await client.set("dataIsPopulated", "true");
  console.log("data finished populating");
} else {
  const testValue = await client.get(
    "0be2866c49136a7909a8ef4f3e638875f01370c628936e51adeede699b392edb"
  );
  console.log("data already populated here is a test", testValue);
}

await client.disconnect();
