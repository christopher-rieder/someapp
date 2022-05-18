import { Car, DraftBudget, Financing } from "@prisma/client";
import { prisma } from "~/db.server"
import { getCar } from "./car.server";
import { getFinancing } from "./financing.server";

type DraftBudgerErrors = {
    carPriceMismatch: boolean
    financing?: String
    promotions?: String
}

type DraftBudgetResponse = {
    errors?: DraftBudgerErrors
    draft: DraftBudget & { car: Car | null; financing: Financing | null; }
    promotions?: {}
}

let dollarUS = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

function validateFinancingAmount({ financing, car, amount }: { financing: Financing, car: Car, amount: number | null }) {
    const max_amount_relative = car.retail_price * financing.max_amount_percentage / 1_00_00
    
    console.log("🚀 ~ file: DraftBudget.server.ts ~ line 24 ~ validateFinancingAmount ~ max_amount_relative", dollarUS.format(max_amount_relative))
    console.log("🚀 ~ file: DraftBudget.server.ts ~ line 29 ~ validateFinancingAmount ~ financing.max_amount_flat", dollarUS.format(financing.max_amount_flat))
    if (!amount) { // TODO: should always be a number. if empry, is 0
        return true
    }
    if (financing.max_amount_percentage > 0 && amount > max_amount_relative) {
        return false
    }
    if (amount > financing.max_amount_flat) {
        return false
    }
    return true

}

export async function getBudgetDraft({ userId }) {
    const errors = {} as DraftBudgerErrors

    const existingDraft = await prisma.draftBudget.findFirst({
        include: { car: true, financing: true },
        where: { userId }
    });

    if (!existingDraft) {
        const newDraft = await prisma.draftBudget.create({
            data: { userId: userId }
        })
        return { draft: newDraft } as DraftBudgetResponse
    }

    if (existingDraft.car) {
        if (existingDraft.car_price !== existingDraft.car.retail_price) {
            errors.carPriceMismatch = true
        }
    }

    if (existingDraft.car && existingDraft.financing) {
        validateFinancingAmount({
            financing: existingDraft.financing,
            car: existingDraft.car,
            amount: existingDraft.amount_financed
        })
        // validate financing with car
        // validate amount

    }

    return {
        draft: existingDraft,
        errors: Object.keys(errors).length > 0 ? errors : null
    } as DraftBudgetResponse

    // validate car
    // validate promotions
}
export async function setBudgetCar({ carId, userId }) {
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

export async function setBudgetFinancing({ financingId, userId }) {
    const existingDraft = await prisma.draftBudget.findFirst({
        where: { userId }
    });
    return prisma.draftBudget.update({
        data: {
            financing_id: financingId
        }, where: { id: existingDraft?.id }
    })
}
