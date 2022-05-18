import { Car, DraftBudget, Financing } from "@prisma/client";
import { prisma } from "~/db.server"
import { getCar } from "./car.server";
import { getFinancing } from "./financing.server";

export type DraftBudgetErrors = {
    carPriceMismatch?: boolean
    amountFinanced?: {
        max: number
        providedValue: number
    }
}

type Calculations = {
    max_amount_financed: number
    applied_discount: number
    max_special_discount: number
    // taxes
}

type DraftBudgetResponse = {
    errors?: DraftBudgetErrors
    draft: DraftBudget & { car: Car | null; financing: Financing | null; }
    calculations: Calculations
}

let dollarUS = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

function validateFinancingAmount({ max_amount_percentage, max_amount_flat, retail_price, amount }:
    { max_amount_percentage: number, max_amount_flat: number, retail_price: number, amount: number }) {

    const max_amount_relative = retail_price * max_amount_percentage / 1_00_00
    const max_financing = Math.max(max_amount_relative, max_amount_flat)
    const amountFinancedNotValid = amount >= max_financing
    return { amountFinancedNotValid, max_financing }

}

export async function getBudgetDraft({ userId }: { userId: string }) {
    const errors = {} as DraftBudgetErrors
    const calculations = {
        max_amount_financed: 0,
        applied_discount: 0,
        max_special_discount: 0,
    } as Calculations

    const existingDraft = await prisma.draftBudget.findFirst({
        include: { car: true, financing: true },
        where: { userId }
    });

    if (!existingDraft) {
        const newDraft = await prisma.draftBudget.create({
            data: { userId: userId, amount_financed: 0 }
        })
        return { draft: newDraft, calculations } as DraftBudgetResponse
    }

    if (existingDraft.car) {
        if (existingDraft.car_price !== existingDraft.car.retail_price) {
            errors.carPriceMismatch = true
        }
    }

    if (existingDraft.car && existingDraft.financing) {
        const financingValidation = validateFinancingAmount({
            max_amount_flat: existingDraft.financing.max_amount_flat,
            max_amount_percentage: existingDraft.financing.max_amount_percentage,
            retail_price: existingDraft.car.retail_price,
            amount: existingDraft.amount_financed,
        })
        calculations.max_amount_financed = financingValidation.max_financing

        if (financingValidation.amountFinancedNotValid) {
            errors.amountFinanced = {
                providedValue: existingDraft.amount_financed,
                max: calculations.max_amount_financed,
            }
            existingDraft.amount_financed = 0

            await prisma.draftBudget.update({
                data: { amount_financed: 0 }, where: { id: existingDraft?.id }
            })
        }
        // validate financing with car
        // validate amount

    }

    return {
        draft: existingDraft,
        calculations,
        errors: Object.keys(errors).length > 0 ? errors : null,
    } as DraftBudgetResponse

    // validate car
    // validate promotions
}
export async function setBudgetCar({ carId, userId }: { carId: string, userId: string }) {
    const existingDraft = await prisma.draftBudget.findFirst({
        where: { userId }
    });
    if (!existingDraft) {
        return null // error
    }

    const draft = await prisma.draftBudget.update({
        data: {
            car_id: carId,
        }, where: { id: existingDraft?.id }
    })
    return draft
}

export async function setBudgetFinancing({ financingId, userId }: { financingId: string, userId: string }) {
    const existingDraft = await prisma.draftBudget.findFirst({
        where: { userId }
    });
    return prisma.draftBudget.update({
        data: {
            financing_id: financingId
        }, where: { id: existingDraft?.id }
    })
}

export async function setAmountFinancing({ amount_financed, userId }: { amount_financed: number, userId: string }) {
    const existingDraft = await prisma.draftBudget.findFirst({
        select: {
            id: true,
            car: { select: { retail_price: true } },
            financing: { select: { max_amount_flat: true, max_amount_percentage: true } }
        },
        where: { userId },
    });

    if (!existingDraft?.financing || !existingDraft?.car) {
        return new Error("Financing not exists")
    }

    const { amountFinancedNotValid, max_financing } = validateFinancingAmount({
        max_amount_flat: existingDraft.financing.max_amount_flat,
        max_amount_percentage: existingDraft.financing.max_amount_percentage,
        retail_price: existingDraft.car.retail_price,
        amount: amount_financed * 100
    })

    if (amountFinancedNotValid) {
        return new Error(`Amount ${amount_financed} is above max allowed value: ${max_financing / 100}`)

    }

    return prisma.draftBudget.update({
        data: {
            amount_financed: amount_financed * 100
        }, where: { id: existingDraft?.id }
    })
}
