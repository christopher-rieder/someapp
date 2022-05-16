import type { Financing } from "@prisma/client";
import { prisma } from "~/db.server";
export type { Financing } from "@prisma/client";


export function getFinancing({ id, }: Pick<Financing, "id">) {
    return prisma.financing.findFirst({
        where: { id }
    });
}

export function getFinancingList() {
    return prisma.financing.findMany();
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
    return prisma.financing.deleteMany({
        where: { id }
    });
}
