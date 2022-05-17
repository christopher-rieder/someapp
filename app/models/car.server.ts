import type { Car } from "@prisma/client";
import { prisma } from "~/db.server";
export type { Car } from "@prisma/client";

function processCar(car: Car) {
  car.retail_price /= 100
}

export async function getCar({ id, }: Pick<Car, "id">) {
  const car = await prisma.car.findFirst({
    where: { id }
  });
  if(car) {
    processCar(car)
  }
  return car
}

export async function getCarList() {
  const carList = await prisma.car.findMany();
  if(carList) {
    carList.forEach(processCar)
  }
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
