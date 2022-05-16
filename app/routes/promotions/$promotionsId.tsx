import { Promotions } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { deletePromotions, getPromotions } from "~/models/promotions.server";

type LoaderData = {
  promotions: Promotions;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.promotionsId, "promotionsId not found");

  const promotions = await getPromotions({ id: params.promotionsId });
  if (!promotions) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ promotions });
};

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.promotionsId, "promotionsId not found");

  await deletePromotions({  id: params.promotionsId });

  return redirect("/promotions");
};

export default function PromotionsDetailsPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <div>
        <pre>
            {JSON.stringify(data, null, 2)}
        </pre>
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
      
      <Link to="/promotions" className="block p-4 text-xl text-blue-500">
        Go Back
      </Link>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>promotions not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
