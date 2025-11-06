import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetTransactionsSummarySchema } from "../../schemas/transaction.schema.js";
import prisma from "../../config/prisma.js";
import type { categorySummary } from "../../types/category.types.js";
import { TransactionType } from "@prisma/client";
import type { TransactionSummary } from "../../types/transaction.types.js";

dayjs.extend(utc);

export const getTransactionsSummary = async (
  request: FastifyRequest<{ Querystring: GetTransactionsSummarySchema }>,
  reply: FastifyReply
): Promise<void> => {
  const userId = request.userId;

  if (!userId) {
    reply.status(401).send({ error: "Usuário não autenticado" });
    return;
  }

  const { month, year } = request.query;

  if (!month || !year) {
    reply.status(400).send({ error: "Mês e ano são obrigatórios" });
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
    let totalIncomes = 0;
    const groupedExpenses = new Map<string, categorySummary>();

    for (const transaction of transactions) {
      if (transaction.type === TransactionType.expense) {
        const existing =
          groupedExpenses.get(transaction.categoryId) ?? {
            categoryId: transaction.categoryId,
            categoryName: transaction.category.name,
            categoryColor: transaction.category.color,
            amount: 0,
            percentage: 0,
          };

        existing.amount += transaction.amount;
        groupedExpenses.set(transaction.categoryId, existing);
        totalExpenses += transaction.amount;
      } else {
        totalIncomes += transaction.amount;
      }
    }

    const summary: TransactionSummary = {
      totalExpenses,
      totalIcomes: totalIncomes,
      balance: Number((totalIncomes - totalExpenses).toFixed(2)),
      expensesByCategory: Array.from(groupedExpenses.values())
        .map((entry) => ({
          ...entry,
          percentage: totalExpenses
            ? Number.parseFloat(((entry.amount / totalExpenses) * 100).toFixed(2))
            : 0,
        }))
        .sort((a, b) => b.amount - a.amount),
    };
console.log("💾 Transações encontradas:", transactions.length);

    reply.send(summary);
  } catch (err) {
    request.log.error({ err }, "Erro ao trazer transações");
    reply.status(500).send({ error: "Erro do servidor" });
  }
};
