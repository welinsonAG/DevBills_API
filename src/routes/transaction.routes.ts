import { type FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import createTransaction from "../controllers/transactions/createTransaction.controller.js";
import {
    createTransactionSchema,
    deleteTransactionSchema,
    getTransactionsSchema,
    getTransactionsSummarySchema
} from "../schemas/transaction.schema.js";
import { getTransactions } from "../controllers/transactions/getTransactions.controller.js";
import { getTransactionsSummary } from "../controllers/transactions/getTransactionsSummary.controller.js";
import { deleteTransaction } from "../controllers/deleteTransaction.controller.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const transactionRoutes = async (fastify: FastifyInstance) => {

    fastify.addHook('preHandler', authMiddleware)
    const app = fastify.withTypeProvider<ZodTypeProvider>();

    // POST /
    app.route({
        method: "POST",
        url: "/",
        schema: {
            body: createTransactionSchema, // ✅ direto, sem zodToJsonSchema
        },
        handler: createTransaction,
    });

    // GET /
    app.route({
        method: "GET",
        url: "/",
        schema: {
            querystring: getTransactionsSchema, // ✅ direto
        },
        handler: getTransactions,
    });

    // GET /summary
    app.route({
        method: "GET",
        url: "/summary",
        schema: {
            querystring: getTransactionsSummarySchema, // ✅ direto
        },
        handler: getTransactionsSummary,
    });



   app.route({

        method: "DELETE",
        url: "/:id",
        schema: {
            params: deleteTransactionSchema,

       },

        handler: deleteTransaction,

    });
}


export default transactionRoutes;
