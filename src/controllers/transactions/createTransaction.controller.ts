import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma.js";
import { createTransactionSchema } from "../../schemas/transaction.schema.js";

const createTransaction = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const userId = "NDCUIHCNNSBCSK"; // userId => request.userId

    if (!userId) {
        reply.status(401).send({ error: "Usuário não autenticado" });
        return;
    }

    const result = createTransactionSchema.safeParse(request.body);
console.log("📦 BODY RECEBIDO:", request.body);

    if (!result.success) { // Invertido para verificar se a validação falhou
          console.error("❌ Erro de validação Zod:", result.error.issues);
        const errorMessage = result.error.issues[0]?.message || "Validação inválida"; // Usando optional chaining
        reply.status(400).send({ error: errorMessage });
        return;
    }

    const transaction = result.data;

    try {
        const category = await prisma.category.findFirst({
            where: {
                id: transaction.categoryId,
                type: transaction.type,
            },
        });

        if (!category) {
            reply.status(400).send({ error: "Categoria inválida" });
            return;
        }

        // Aqui você pode adicionar a lógica para criar a transação no banco de dados

        reply.status(201).send({ message: "Transação criada com sucesso" }); // Resposta de sucesso
    } catch (err) {
        console.error(err); // Registra o erro no console
        reply.status(500).send({ error: "Erro ao criar a transação" }); // Resposta de erro
    }
};

export default createTransaction;

