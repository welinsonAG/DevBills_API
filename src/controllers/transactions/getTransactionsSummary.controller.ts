import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { FastifyReply, FastifyRequest } from "fastify"
import type { GetTransactionsSummarySchema } from "../../schemas/transaction.schema.js"
import prisma from "../../config/prisma.js";
import type { categorySummary } from "../../types/category.types.js";
import { TransactionType } from "@prisma/client";



dayjs.extend(utc)

export const getTransactionsSummary = async (
    request: FastifyRequest<{ Querystring: GetTransactionsSummarySchema }>,
    reply: FastifyReply,
): Promise<void> => {

    const userId = "NDCUIHCNNSBCSK"; // userId => request.userId

    if (!userId) {
        reply.status(401).send({ error: "Usuário não autenticado" });
        return;
    }

    const { month, year } = request.query;

    if (!month || !year) {
        reply.status(400).send({ error: "Mês e ano são obrigatório" })
        return;
    }

    const startDate = dayjs(`${year}-${month}-01`).startOf("month").toDate();
    const endDate = dayjs(startDate).endOf("month").toDate();

    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },

            include: {
                category: true,

            },

        });
        let totalExpenses = 0;
        let totalIcomes = 0;
        const groupedExpenses = new Map<string, categorySummary>();

        for (const transaction of transactions) {

            if (transaction.type === TransactionType.expense) {

                const existing = groupedExpenses.get(transaction.categoryId) ?? {
                    categoryId: transaction.categoryId,
                    categoryName: transaction.category.name,
                    categoryColor: transaction.category.color,
                    amount: 0,
                    percentage: 0,
                }
             

                totalExpenses += transaction.amount

            } else {
                totalIcomes += transaction.amount
            }
        }
console.log({groupedExpenses, totalIcomes, totalExpenses})
        reply.send(transactions);
    } catch (err) {
        request.log.error("Erro ao traser transações");
        reply.status(500).send({ error: "Erro do servidor" });
    }
}