import { z } from "zod";
import dotenv from 'dotenv'


dotenv.config()

const envSchema = z.object({
    PORT: z.string().transform(Number).default(3001),
    DATABASE_URL: z.string().min(5, "DATABASE_URL é obrigatorio"),
    NODE_ENV: z.enum(['dev', 'test', 'prod'],{
        message: "O Node ENV deve ser dev, test, prod",
    })
})

const _env = envSchema.safeParse(process.env)

if(!_env.success){
console.log("🚨 Variaveis de ambiente")
process.exit(1)
}

export const env = _env.data