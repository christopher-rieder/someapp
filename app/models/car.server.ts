import type { Car } from "@prisma/client";
import { prisma } from "~/db.server";
export type { Car } from "@prisma/client";

export function getCar({ id, }: Pick<Car, "id">) {
  return prisma.car.findFirst({
    where: { id }
  });
}

export function getCarList() {
  return prisma.car.findMany();
}

export function createCar({
  brand,
  model,
  version,
  retail_price,
  image,
  color,
  year,
}: Pick<Car, "brand" | "model" | "version" | "retail_price" | "image" | "color" | "year">) {
  return prisma.car.create({
    data: {
      brand,
      model,
      version,
      retail_price,
      image,
      color,
      year,
    },
  });
}

export function deleteCar({ id }: Pick<Car, "id">) {
  return prisma.car.deleteMany({
    where: { id }
  });
}
