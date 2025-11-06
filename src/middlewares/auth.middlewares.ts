
import type { FastifyRequest,  FastifyReply } from "fastify";
import  Admin  from "firebase-admin";

declare module "fastify"{
    interface FastifyRequest{
        userId?: string;
    }
}
export const authMiddleware = async(
    request: FastifyRequest, reply: FastifyReply):Promise<void> => {

        const authHeader = request.headers.authorization;

        if (!authHeader) {
            reply.code(401).send({ error: "Token de autorização não fornecido" });
            return;
        }

        const token = authHeader.replace("Bearer ", "");

        try {
            const decodedToken = await Admin.auth().verifyIdToken(token);

            request.userId = decodedToken.uid;
        } catch (err) {
            request.log.error("Erro ao verificar o token: " + String(err));

            reply.code(401).send({ error: "Token já expirado ou inválido" });
        }
    }
