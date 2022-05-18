import { Car, DraftBudget } from "@prisma/client";
import { Form, useActionData, useFetchers, useLoaderData } from "@remix-run/react";
import { ActionFunction, json, LoaderFunction } from "@remix-run/server-runtime";
import classNames from "classnames";
import GenericMoney from "~/components/GenericMoney";
import PickCar from "~/components/PickCar";
import PickFinancing from "~/components/PickFinancing";
import { getCarList } from "~/models/car.server";
import { DraftBudgetErrors, getBudgetDraft, setAmountFinancing, setBudgetCar, setBudgetFinancing } from "~/models/DraftBudget.server";
import { getFinancingList } from "~/models/financing.server";
import { getUserId, requireUserId } from "~/session.server";

type LoaderData = {
    carList?: Awaited<ReturnType<typeof getCarList>>;
    financingList?: Awaited<ReturnType<typeof getFinancingList>>;
    draft: Awaited<ReturnType<typeof getBudgetDraft>>;
};

export const loader: LoaderFunction = async ({ request }) => {
    const userId = await getUserId(request)
    const draft = await getBudgetDraft({ userId })

    const response = { draft } as LoaderData
    const searchParams = new URL(request.url).searchParams
    if (searchParams.get('pick') === 'car') {
        const carList = await getCarList();
        response.carList = carList
    }
    if (searchParams.get('pick') === 'financing') {
        const financingList = await getFinancingList();
        response.financingList = financingList
    }
    return json<LoaderData>(response);
};


export const action: ActionFunction = async ({ request, params }) => {
    const userId = await requireUserId(request);

    const formData = await request.formData();
    const carId = formData.get('pick-car')
    const financingId = formData.get('pick-financing')

    if (formData.has('amount_financed')) {
        const amount_financed = Number(formData.get('amount_financed'))
        const response = await setAmountFinancing({ amount_financed, userId })
        if(response instanceof Error) {
            return json(
                { errors: response.message },
                { status: 400 }
              );
        }
        return setAmountFinancing({ amount_financed, userId })
    }

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
    const draft = data.draft.draft
    const calculations = data.draft.calculations

    return (
        <div>
            <div className="bg-white flex m-10">
                <CarCard car={draft.car} />
                <FinancingCard
                    draft={draft}
                    max_amount_financed={calculations.max_amount_financed}
                    errors={data.draft.errors}
                />
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


function CarCard({ car }: { car: Car | null }) {
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
            <PickCar />
        </section>
    )

}

function FinancingCard({ draft, max_amount_financed, errors }:
    {
        draft: Awaited<ReturnType<typeof getBudgetDraft>>['draft']
        max_amount_financed: number
        errors?: DraftBudgetErrors
    }) {
    const car = draft.car
    const financing = draft.financing
    const adata = useActionData()

    const fetchers = useFetchers()
    const pickingCar = fetchers.some(fetcher => (Boolean(fetcher?.state === "submitting") && fetcher?.submission?.action.includes("pick=car")) || Boolean(fetcher?.data?.carList))

    return (
        <section className="flex-1">
            {financing ? (
                <div className="financing-card">
                    <div>picked: {financing.name}</div>
                    <div>max: <GenericMoney num={financing.max_amount_flat} /></div>
                    <div>max: {financing.max_amount_percentage / 100}%</div>
                    <Form method="post">
                        <label htmlFor="amount_financed">Amount Financed: </label>
                        <input
                            defaultValue={draft.amount_financed / 100}
                            className={classNames("money-input", { "text-red-700": errors?.amountFinanced })}
                            type="number"
                            name="amount_financed"
                            id="amount_financed"
                            // max={max_amount_financed / 100}
                            min={0}
                            step="0.01"
                        />
                        <button type="submit">Set</button>
                        {errors?.amountFinanced ? (
                            <div className="text-red-700">
                                ERROR| max: {errors.amountFinanced.max} | provided: {errors.amountFinanced.providedValue} | saved: {draft.amount_financed / 100}
                            </div>
                        ) : null}
                        {adata?.errors ? (
                            <div className="text-red-700">
                                ERROR {adata?.errors}
                            </div>
                        ): null}
                    </Form>
                </div>
            ) : (
                <span className="not-selection">financing not selected</span>
            )}
            <PickFinancing key={String(car?.id) + pickingCar} pickingCar={pickingCar} carId={car?.id} />
        </section>
    )
}