
import type { FastifyInstance } from "fastify"
import createTransaction from "../controllers/transactions/createTransaction.controller.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import  { createTransactionSchema, getTransactionsSchema, getTransactionsSummarySchema, } from "../schemas/transaction.schema.js";
import { getTransactions } from "../controllers/transactions/getTransactions.controller.js";
import { getTransactionsSummary } from "../controllers/transactions/getTransactionsSummary.controller.js";



 const transactionRoutes = async(fastify: FastifyInstance) => {
    // criação
 fastify.route({
method:"POST",
url: "/",
schema:{
    body: zodToJsonSchema(createTransactionSchema)
    
},
 handler:createTransaction
 
    });
    
    fastify.route({
        method: "GET",
        url: "/",
        schema: {
            querystring: zodToJsonSchema(getTransactionsSchema)
        },
        handler: getTransactions,
    });
fastify.route({
        method: "GET",
        url: "/summary",
        schema: {
            querystring: zodToJsonSchema(getTransactionsSummarySchema)
        },
     handler: getTransactionsSummary,
    });
 }
export default transactionRoutes;