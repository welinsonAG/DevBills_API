import type { FastifyReply, FastifyRequest } from "fastify"

import type { DeleteTransactionParams } from "../schemas/transaction.schema.js"
import prisma from "../config/prisma.js";

import { ObjectId } from "bson";

export const deleteTransaction = async (request: FastifyRequest<{ Params: DeleteTransactionParams }>,
    reply: FastifyReply,

): Promise<void> => {
    const userId = request.userId;
    const { id } = request.params as {id: string}

    if (!userId) {
        reply.status(401).send({ error: "Usuario não cadrastrado" });
        return;
    }

    

if (!ObjectId.isValid(id)) {
  reply.status(400).send({ error: "ID inválido (não é ObjectId válido)" });
  return;
}


    try {

        const transaction = await prisma.transaction.findFirst({
            where: {
                id, userId,
            }
        })
      

        await prisma.transaction.delete({ where: {  id } })
        reply.status(200).send({ message: "Transação deletada com louvor" })
    } catch (err) {
        request.log.error({ message: "Erro ao deletar a transação" })
        reply.status(500).send({ message: "Erro interno do servidor, falha ao deletar a transação" })

    }
} 








   /* export const deleteTransaction = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const userId = "NDCUIHCNNSBCSK" // futuramente pegar do auth
  const { id } = request.params

  if (!userId) {
    return reply.status(401).send({ error: "Usuário não cadastrado" })
  }

  try {
    // verifica se a transação existe e pertence ao usuário
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId }
    })

    if (!transaction) {
      return reply.status(404).send({ error: "Transação não encontrada para este usuário" })
    }

    // deleta a transação
    await prisma.transaction.delete({
      where: { id }
    })

    return reply.status(200).send({ message: "Transação deletada com sucesso" })
  } catch (err: any) {
    request.log.error(err) // log detalhado do erro
    return reply.status(500).send({ error: "Erro interno ao deletar transação" })
  }
}*/