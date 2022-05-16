import { Car } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { deleteCar, getCar } from "~/models/car.server";

type LoaderData = {
  car: Car;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.carId, "carId not found");

  const car = await getCar({ id: params.carId });
  if (!car) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ car });
};

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.carId, "carId not found");

  await deleteCar({  id: params.carId });

  return redirect("/cars");
};

export default function CarDetailsPage() {
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
      
      <Link to="/cars" className="block p-4 text-xl text-blue-500">
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
    return <div>Car not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
