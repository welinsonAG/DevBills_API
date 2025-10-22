
import app from "./app.js";
import { prismaConnect } from "./config/prisma.js";
import { inicializeGlobalCategories } from "./services/globalCategories.service.js";
import { env } from "./config/env.js";
import transactionRoutes from "./routes/transaction.routes.js";

const PORT = env.PORT;

app.register(transactionRoutes, { prefix: '/api' })

const startServer = async () => {
	try {
		await prismaConnect()

		await inicializeGlobalCategories()

		await app.listen({ port: PORT }).then(() => { 
		console.log(`✅ Server listening on port ${PORT}`);
		 });

	} catch (err) {
		console.error("❌ Error starting server:", err);
		process.exit(1);
	}
};

startServer();
