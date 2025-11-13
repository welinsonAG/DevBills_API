import { z } from 'zod'
import { ObjectId } from 'mongodb'
import { TransactionType } from '@prisma/client';

const isValidObjectId = (id: string)  => ObjectId.isValid(id);


export const createTransactionSchema = z.object({
    description: z.string().min(1, "Descrção obrigatória"),
    amount: z.number().positive("Valor deve ser Positivo"),
    date: z.string().refine(val => !isNaN(Date.parse(val)),{
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
   year: z.coerce.number({message: "O ano é obrigatorio"}),
   
 })

  export const getHistoricalTransactionsSchema = z.object({
  month: z.coerce.number().min(1,{message: "Mês inválido"}).max(12,{message: "Mês inválido"}),
   year: z.coerce.number().min(2000,{message: "Ano invalido"}).max(2030,{message:"Ano invalido"}).optional(),
   months: z.coerce.number().min(1,{message: "Deve ser no minimo 1 mês"}).max(12,{message: "Deve ser no maximo 12 meses"}).optional(),
   
 })

 export const deleteTransactionSchema = z.object({
   id:z.string().refine(isValidObjectId,{
    message: "ID invalido",
   })
 })

export type getHistoricalTransactionsSchemaQuery = z.infer<typeof getHistoricalTransactionsSchema>;
 export type GetTransactionsQuery = z.infer<typeof getTransactionsSchema>;
  export type GetTransactionsSummarySchema = z.infer<typeof getTransactionsSummarySchema>;
   export type DeleteTransactionParams = z.infer<typeof deleteTransactionSchema>;


