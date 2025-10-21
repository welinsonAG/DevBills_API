import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import  routes from "./routes/index.js";
import { env } from "./config/env.js";

import { validatorCompiler, serializerCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";

const app:FastifyInstance = Fastify({
  logger: {
    level: env.NODE_ENV === "dev" ? "info" : "error",
    
    
  }
  
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.withTypeProvider<ZodTypeProvider>().register(routes, {prefix: '/api'})

export default app;
