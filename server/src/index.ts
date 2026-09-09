import { createApp } from "./app.js";
import { closeDb, connectDb } from "./db.js";
import { env } from "./env.js";

await connectDb();

const server = createApp().listen(env.PORT, () => {
  console.log(`RoomCall API listening on http://localhost:${env.PORT}`);
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    server.close(() => {
      void closeDb().then(() => process.exit(0));
    });
  });
}
