import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const cars = [
  {
    brand: 'Fiat',
    model: 'Cronos',
    version: '1.3',
    retail_price: 2_500_000_00,
    image: 'fiat-cronos',
    color: 'blanco',
    year: 2022
  },
  {
    brand: 'Chevrolet',
    model: 'S10',
    version: '2.8 TD 4X4 LTZ AT',
    retail_price: 8_200_000_00,
    image: 'chevrolet-s10-28',
    color: 'gris',
    year: 2022
  },
  {
    brand: 'Toyota',
    model: 'Corolla',
    version: '2.0Seg CVT 170cv',
    retail_price: 6_800_000_00,
    image: 'toyota-corolla-20_seg_cvt_170cv',
    color: 'blanco',
    year: 2022
  },
]

const financing = [
  {
    name: 'Financing#1',
    issuer: 'Issuer#1',
    max_amount_percentage: 75_00,
    max_amount_flat: 2_000_000_00,
    selector: 'brand=Fiat,Chevrolet'
  },
  {
    name: 'Financing#2',
    issuer: 'Issuer#2',
    max_amount_percentage: 50_00,
    max_amount_flat: 1_250_000_00,
    selector: 'brand=Toyota'
  },
  {
    name: 'Financing#3',
    issuer: 'Issuer#3',
    max_amount_percentage: 66_00,
    max_amount_flat: 3_500_000_00,
    selector: 'max_price=7500000'
  },
]

const promotions = [
  {
    name: 'Promo#1',
    selector: 'toyota-corolla-20_seg_cvt_170cv',
    discount_percentage: 5_00,
    discount_flat: 75_000_00,
    is_special_discount: false
  },
  {
    name: 'Promo#2',
    selector: 'brand=Toyota',
    discount_percentage: 0,
    discount_flat: 100_000_00,
    is_special_discount: false
  },
  {
    name: 'Promo#3',
    selector: 'max_price=7500000',
    discount_percentage: 5_00,
    discount_flat: 0,
    is_special_discount: false
  },
  {
    name: 'Promo#4',
    selector: 'toyota-corolla-20_seg_cvt_170cv',
    discount_percentage: 1_00,
    discount_flat: 15_000_00,
    is_special_discount: true
  },
  {
    name: 'Promo#5',
    selector: 'brand=Toyota',
    discount_percentage: 2_50,
    discount_flat: 0,
    is_special_discount: true
  },
  {
    name: 'Promo#6',
    selector: 'max_price=7500000',
    discount_percentage: 3_33,
    discount_flat: 125_000_00,
    is_special_discount: true
  },
]

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.car.deleteMany().catch(() => { });

  await prisma.car.create({
    data: cars[0],
  });
  await prisma.car.create({
    data: cars[1],
  });
  await prisma.car.create({
    data: cars[2],
  });

  await prisma.financing.deleteMany().catch(() => { });
  await prisma.financing.create({
    data: financing[0],
  });
  await prisma.financing.create({
    data: financing[1],
  });
  await prisma.financing.create({
    data: financing[2],
  });

  await prisma.promotions.deleteMany().catch(() => { });
  await prisma.promotions.create({
    data: promotions[0],
  });
  await prisma.promotions.create({
    data: promotions[1],
  });
  await prisma.promotions.create({
    data: promotions[2],
  });
  await prisma.promotions.create({
    data: promotions[3],
  });
  await prisma.promotions.create({
    data: promotions[4],
  });
  await prisma.promotions.create({
    data: promotions[5],
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
