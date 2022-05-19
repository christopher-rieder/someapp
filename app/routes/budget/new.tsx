import { useLoaderData } from "@remix-run/react";
import { ActionFunction, json, LoaderFunction, MetaFunction } from "@remix-run/server-runtime";
import PickCar from "~/components/PickCar";
import PickFinancing from "~/components/PickFinancing";
import { carList, getCarList } from "~/models/car.server";
import { getBudgetDraft, setAmountFinancing, setBudgetCar, setBudgetFinancing } from "~/models/DraftBudget.server";
import { financingList, getFinancingList } from "~/models/financing.server";
import CarCard from "~/screens/budget/CarCard";
import FinancingCard from "~/screens/budget/FinancingCard";
import { requireUserId } from "~/session.server";

export type LoaderData = {
    carList?: carList;
    financingList?: financingList;
    draft: Awaited<ReturnType<typeof getBudgetDraft>>;
};

export const loader: LoaderFunction = async ({ request }) => {
    const userId = await requireUserId(request);
    const draft = await getBudgetDraft({ userId })

    const response = { draft } as LoaderData
    const searchParams = new URL(request.url).searchParams

    if (searchParams.has('pick')) {
        const pick = searchParams.get('pick')
        if (pick === 'car') {
            response.carList = await getCarList();
        }
        if (pick === 'financing') {
            response.financingList = await getFinancingList();
        }
    }

    return json<LoaderData>(response);
};

export const action: ActionFunction = async ({ request }) => {
    const userId = await requireUserId(request);
    const formData = await request.formData();

    if (formData.has('amount_financed')) {
        const amount_financed = Number(formData.get('amount_financed'))
        const response = await setAmountFinancing({ amount_financed, userId })
        if (response instanceof Error) {
            return json({ errors: response.message }, { status: 400 });
        }
        return setAmountFinancing({ amount_financed, userId })
    }

    if (formData.has('pick-car')) {
        const carId = formData.get('pick-car')
        if (typeof carId === "string" && carId.length > 0) {
            return setBudgetCar({ userId, carId })
        } else {
            return json({ errors: { pickCar: true } }, { status: 400 });
        }
    }

    if(formData.has('pick-financing')) {
        const financingId = formData.get('pick-financing')
        if (typeof financingId === "string" && financingId.length > 0) {
            return setBudgetFinancing({ financingId, userId })
        } else {
            return json({ errors: { pickFinancing: true } }, { status: 400 });
        }
    }

    return null
};


export default function BudgetScreen() {
    const data = useLoaderData() as LoaderData
    const draft = data.draft.draft
    const calculations = data.draft.calculations

    return (
        <div>
            <div className="bg-white flex m-10">
                <CarCard car={draft.car}>
                    <PickCar carList={data.carList} />
                </CarCard>
                <FinancingCard
                    financing={draft.financing}
                    amount_financed={draft.amount_financed}
                    max_amount_financed={calculations.max_amount_financed}
                    errors={data.draft.errors}
                >
                    <PickFinancing
                        key={draft.car?.id}
                        carId={draft.car?.id}
                        financingList={data.financingList}
                    />
                </FinancingCard>
                <div className="flex-1">
                    <div>--summary-here--</div>
                    <div>--dependency-with-all-prices--</div>
                    <div>--details-and-final-amount--</div>
                    <div>--taxes-refresh--</div>
                    <div>--final-amount-refreshed--</div>
                </div>
            </div>
            <div className="m-10">
                <div>state for disabling buttons</div>
                <div>error boundary for each promotions and financing</div>
            </div>
        </div>
    )
}

export const meta: MetaFunction = () => {
    return {
        title: "Draft Budget",
    };
};
