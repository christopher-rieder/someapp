import { Financing } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { deleteFinancing, getFinancing } from "~/models/financing.server";

type LoaderData = {
  financing: Financing;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.financingId, "financingId not found");

  const financing = await getFinancing({ id: params.financingId });
  if (!financing) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ financing });
};

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.financingId, "financingId not found");

  await deleteFinancing({  id: params.financingId });

  return redirect("/financing");
};

export default function FinancingDetailsPage() {
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
      
      <Link to="/financing" className="block p-4 text-xl text-blue-500">
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
    return <div>Financing not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
