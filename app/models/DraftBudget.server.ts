import { prisma } from "~/db.server"

export async function getBudgetDraft({ userId }) {
    const existingDraft = await prisma.draftBudget.findFirst({
        where: { userId }
    });
    if (existingDraft) {
        return existingDraft
    } else {
        return createBudgetDraft({ userId })
    }
}

function createBudgetDraft({ userId }) {
    return prisma.draftBudget.create({
        data: {
            userId: userId
        }
    })
}

export async function setBudgetCar({ carId, userId }) {
    const existingDraft = await prisma.draftBudget.findFirst({
        where: { userId }
    });
    return prisma.draftBudget.update({
        data: {
            car_id: carId
        }, where: { id: existingDraft?.id }
    })
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