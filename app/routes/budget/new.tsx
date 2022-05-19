import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { ActionFunction, json, LoaderFunction, MetaFunction } from "@remix-run/server-runtime";
import { Link } from "react-router-dom";
import { getBudgetDraft, setAmountFinancing } from "~/models/DraftBudget.server";
import CarCard from "~/screens/budget/CarCard";
import FinancingCard from "~/screens/budget/FinancingCard";
import { requireUserId } from "~/session.server";

export type LoaderData = {
    draft: Awaited<ReturnType<typeof getBudgetDraft>>;
};

export const loader: LoaderFunction = async ({ request }) => {
    const userId = await requireUserId(request);
    const draft = await getBudgetDraft({ userId })
    const response = { draft } as LoaderData
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

    return null
};


export default function BudgetScreen() {
    const data = useLoaderData() as LoaderData
    const draft = data.draft.draft
    const calculations = data.draft.calculations
    const pickingCar = useLocation().pathname.includes('pick-car')
    const pickingFinancing = useLocation().pathname.includes('pick-financing')

    return (
        <div>
            <div className="bg-white flex m-10">
                <CarCard car={draft.car}>
                    {pickingCar ? <Outlet /> : (
                        <button className="block p-4 text-xl text-blue-500" >
                            <Link to="pick-car">
                                Pick Car
                            </Link>
                        </button>
                    )}
                </CarCard>
                <FinancingCard
                    financing={draft.financing}
                    amount_financed={draft.amount_financed}
                    max_amount_financed={calculations.max_amount_financed}
                    errors={data.draft.errors}
                >
                    {pickingFinancing ? <Outlet /> : (
                        <button className="block p-4 text-xl text-blue-500" >
                            <Link to="pick-financing">
                                Pick Financing
                            </Link>
                        </button>
                    )}
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
