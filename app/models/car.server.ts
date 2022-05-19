import type { Car } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getCar({ id, }: Pick<Car, "id">) {
  const car = await prisma.car.findFirst({
    where: { id }
  });

  return car
}

export type carList = Awaited<ReturnType<typeof getCarList>> | undefined

export async function getCarList() {
  const carList = await prisma.car.findMany();
  return carList
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
