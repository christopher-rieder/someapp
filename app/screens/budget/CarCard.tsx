import { Car } from "@prisma/client";
import GenericMoney from "~/components/GenericMoney";

type props = {
    car?: Car
    children: React.ReactChild
}

export default function CarCard({ car, children }: props) {
    return (
        <section className="flex-1">
            {car ? (
                <div className="car-card">
                    <div>picked: {car.brand} {car.model}</div>
                    <div>price: <GenericMoney num={car.retail_price} /></div>
                </div>

            ) : (
                <span className="not-selection">car not selected</span>
            )}
            {children}
        </section>
    )
}