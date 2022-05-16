import { Car } from "@prisma/client";

interface PickCar {
  carList: Array<Car>;
}

export default function PickCar({ carList }: PickCar) {
  return (
    <div>
      {
        carList.map((car)=>{
          return (
            <div>
              <div>{`${car.brand} ${car.model} ${car.version} - $${car.retail_price/100}`}</div>
              <pre className="car-list-item-ugly">{JSON.stringify(car)}</pre>
            </div>
          )
        })
      }
    </div>
  )
}