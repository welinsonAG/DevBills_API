import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetTransactionsQuery } from "../../schemas/transaction.schema.js";
import type { TransactionFilter } from "../../types/transaction.types.js";
import dayjs from "dayjs";
import prisma from "../../config/prisma.js";
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)


export const getTransactions = async (
    request: FastifyRequest<{ Querystring: GetTransactionsQuery }>,
    reply: FastifyReply,): Promise<void> => {
    const userId = "NDCUIHCNNSBCSK";
    if (!userId) {
        reply.status(401).send({ error: "Usuário não autenticado" });
        return;
    }
    const { month, year, categoryId, type } = request.query;

    const filters: TransactionFilter = { userId };

    if (month && year) {
        const startDate = dayjs(`${year}-${month}-01`).startOf("month").toDate();
        const endDate = dayjs(startDate).endOf("month").toDate();
        filters.date = { gte: startDate, lte: endDate };
    }

    if (type) {
        filters.type = type;
    }

    if (categoryId) {
        filters.categoryId = categoryId;
    }

    try {
        const transactions = await prisma.transaction.findMany({
            where: filters,
            orderBy: { date: "desc" },
            include: {
                category: {
                    select: {
                        color: true,
                        name: true,
                        type: true,
                    }
                }
            }
        })
       
        reply.send(transactions);
    } catch (err) {
        request.log.error("Erro ao traser transações");
        reply.status(500).send({ error: "Erro do servodor" });
    }
}


