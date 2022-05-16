import type { Promotions } from "@prisma/client";
import { prisma } from "~/db.server";
export type { Promotions } from "@prisma/client";


export function getPromotions({ id, }: Pick<Promotions, "id">) {
    return prisma.promotions.findFirst({
        where: { id }
    });
}

export function getPromotionsList() {
    return prisma.promotions.findMany();
}

export function createPromotions({
    name,
    selector,
    discount_percentage,
    discount_flat,
    is_special_discount,
}: Pick<Promotions, "name" | "selector" | "discount_percentage" | "discount_flat" | "is_special_discount">) {
    return prisma.promotions.create({
        data: {
            name,
            selector,
            discount_percentage,
            discount_flat,
            is_special_discount,
        },
    });
}

export function deletePromotions({ id }: Pick<Promotions, "id">) {
    return prisma.promotions.deleteMany({
        where: { id }
    });
}
