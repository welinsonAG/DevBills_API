import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/pt-br.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { getHistoricalTransactionsSchemaQuery } from "../../schemas/transaction.schema.js";
import prisma from "../../config/prisma.js";

dayjs.extend(utc);
dayjs.locale("pt-br");

export const getHistoricalTransactions = async (
  request: FastifyRequest<{ Querystring: getHistoricalTransactionsSchemaQuery }>,
  reply: FastifyReply
): Promise<void> => {
  const userId = request.userId;

  if (!userId) {
    reply.status(401).send({ error: "Usuário não autenticado" });
    return;
  }

  const {
    month = new Date().getMonth() + 1,
    year = new Date().getFullYear(),
    months = 6,
  } = request.query;

  const baseDate = new Date(year, month - 1, 1);
  const startDate = dayjs.utc(baseDate).subtract(months - 1, "month").startOf("month").toDate();
  const endDate = dayjs.utc(baseDate).endOf("month").toDate();

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        amount: true,
        date: true,
        type: true,
      },
    });

    const monthlyData = Array.from({ length: months }, (_, i) => {
      const date = dayjs.utc(baseDate).subtract(months - 1 - i, "month");
      return {
        name: date.format("MMM/YYYY").replace(".", ""),
        income: 0,
        expenses: 0,
      };
    });

    transactions.forEach((transaction) => {
      const monthKey = dayjs.utc(transaction.date).format("MMM/YYYY").replace(".", "");
      const monthData = monthlyData.find((m) => m.name === monthKey);

      if (monthData) {
        if (transaction.type === "income") {
          monthData.income += transaction.amount;
        } else {
          monthData.expenses += transaction.amount;
        }
      }
    });

    reply.send({ history: monthlyData });
  } catch (err) {
    request.log.error({ err }, "Erro ao trazer histórico de transações");
    reply.status(500).send({ error: "Erro do servidor" });
  }
};
