import { useLoaderData } from "@remix-run/react";
import { ActionFunction, json, LoaderFunction } from "@remix-run/server-runtime";
import PickCar from "~/components/PickCar";
import PickFinancing from "~/components/PickFinancing";
import { getCar, getCarList } from "~/models/car.server";
import { getBudgetDraft, setBudgetCar, setBudgetFinancing } from "~/models/DraftBudget.server";
import { getFinancing, getFinancingList } from "~/models/financing.server";
import { getUserId } from "~/session.server";

type Calculations = {
    priceBeforeTaxes?: number
    taxes?: number
    totalPrice?: number
}
type LoaderData = {
    carList?: Awaited<ReturnType<typeof getCarList>>;
    financingList?: Awaited<ReturnType<typeof getFinancingList>>;
    draft: Awaited<ReturnType<typeof getBudgetDraft>>;
    car?: Awaited<ReturnType<typeof getCar>>;
    financing?: Awaited<ReturnType<typeof getFinancing>>;
    calculations: Calculations
};

export const loader: LoaderFunction = async ({ request }) => {
    const userId = await getUserId(request)
    const draft = await getBudgetDraft({ userId })
    const calculations = {} as Calculations

    const response = {
        draft,
        calculations
    } as LoaderData
    const searchParams = new URL(request.url).searchParams
    if (searchParams.get('pick') === 'car') {
        const carList = await getCarList();
        response.carList = carList
    }
    if (searchParams.get('pick') === 'financing') {
        const financingList = await getFinancingList();
        response.financingList = financingList
    }
    if (draft.car_id) {
        const car = await getCar({ id: draft.car_id })
        if (car) {
            response.car = car
            calculations.priceBeforeTaxes = car.retail_price
        }
    }
    if (draft.financing_id) {
        const financing = await getFinancing({ id: draft.financing_id })
        if (financing) {
            response.financing = financing
            if(draft.amount_financed) {
                // TODO: validate if amount is valid with this financing
                if (calculations.priceBeforeTaxes) {
                    calculations.priceBeforeTaxes -= draft.amount_financed
                }
            }
        }
    }
    return json<LoaderData>(response);
};


export const action: ActionFunction = async ({ request, params }) => {
    const userId = await getUserId(request)

    const formData = await request.formData();
    const carId = formData.get('pick-car')
    const financingId = formData.get('pick-financing')
    if (typeof carId === "string" && carId.length > 0) {
        return setBudgetCar({ userId, carId })
    }
    if (typeof financingId === "string" && financingId.length > 0) {
        return setBudgetFinancing({ financingId, userId })
    }

    return null
};

export default function BudgetListPage() {
    const data = useLoaderData() as LoaderData
    return (
        <div>
            <div className="bg-white flex m-10">
                <div className="flex-1">
                    {/* <div>--car-here--</div>
                    <div>--price-validation--</div>
                    <div>--discounts--</div>
                    <div>--discounts-validation--</div>
                    <div>--special-discounts--</div>
                    <div>--special-discounts-validation--</div> */}
                    <div>picked: {data.car?.brand} {data.car?.model}</div>
                    <div>price: ${data.car?.retail_price}</div>
                    <PickCar />
                </div>
                <div className="flex-1">
                    {/* <div>--financing-here--</div>
                    <div>--car-dependency--</div>
                    <div>--amount-validation--</div> */}
                    <div>picked: {data.financing?.name}</div>
                    <div>max: {data.financing?.max_amount_flat}</div>
                    <div>max%: {data.financing?.max_amount_percentage}</div>
                    <PickFinancing />
                </div>
                <div className="flex-1">
                    <div>--summary-here--</div>
                    <div>--dependency-with-all-prices--</div>
                    <div>--details-and-final-amount--</div>
                    <div>--taxes-refresh--</div>
                    <div>--final-amount-refreshed--</div>
                </div>
            </div>
            <div className="m-10">
                <div>save-draft: sessionStorage? server-side? both?</div>
                <div>nested-routes or query-string for querying data?</div>
                <div>how to query data for pick-me state for first and second card</div>
                <div>how to update taxes when changing amounts?</div>
                <div>state for disabling buttons</div>
                <div>error boundary for each promotions and financing</div>
            </div>
        </div>
    )
}