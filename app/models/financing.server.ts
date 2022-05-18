import type { Financing } from "@prisma/client";
import { prisma } from "~/db.server";
export type { Financing } from "@prisma/client";

export async function getFinancing({ id, }: Pick<Financing, "id">) {
    const financing = await prisma.financing.findFirst({
        where: { id }
    });
    return financing
}

export async function getFinancingList() {
    const financingList = await prisma.financing.findMany();
    return financingList
}

export function createFinancing({
    name,
    issuer,
    max_amount_percentage,
    max_amount_flat,
    selector,
}: Pick<Financing, "name" | "issuer" | "max_amount_percentage" | "max_amount_flat" | "selector">) {
    return prisma.financing.create({
        data: {
            name,
            issuer,
            max_amount_percentage,
            max_amount_flat,
            selector,
        },
    });
}

export function deleteFinancing({ id }: Pick<Financing, "id">) {
    return prisma.financing.delete({
        where: { id }
    });
}
