import { z } from 'zod'
import { ObjectId } from 'mongodb'
import { TransactionType } from '@prisma/client';

const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);


export const createTransactionSchema = z.object({
    description: z.string().min(1, "Descrção obrigatória"),
    amount: z.number().positive("Valor deve ser Positivo"),
    date: z.coerce.date({
        message: "Data inválida"
    }),
    categoryId: z.string().refine(isValidObjectId, {
  message: "Categoria inválida",
    }),
    
   type: z.enum([TransactionType.expense, TransactionType.income], {
    message: "Tipo deve ser 'income' ou 'expense'"
   })
    });

 export const getTransactionsSchema = z.object({
   month: z.string().optional(),
   year: z.string().optional(),

   type: z.enum([TransactionType.expense, TransactionType.income], {
    message: "Tipo deve ser 'income' ou 'expense'"
   }).optional(),
    
       categoryId: z.string().refine(isValidObjectId, {
  message: "Categoria inválida",
    
 })
.optional(),
 });

 export const getTransactionsSummarySchema = z.object({
  month: z.coerce.string({message: "O mês é obrigatorio"}),
   year: z.coerce.string({message: "O ano é obrigatorio"}),

 })
 export type GetTransactionsQuery = z.infer<typeof getTransactionsSchema>;
  export type GetTransactionsSummarySchema = z.infer<typeof getTransactionsSummarySchema>;


