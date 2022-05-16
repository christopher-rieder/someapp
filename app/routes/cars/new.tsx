import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import GenericFormInput from "~/components/GenericFormInput";
import { createCar } from "~/models/car.server";

type ActionData = {
  errors?: {
    brand?: string;
    model?: string;
    version?: string;
    retail_price?: string;
    image?: string;
    color?: string;
    year?: string;
  };
};


export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const brand = formData.get("brand")
  const model = formData.get("model")
  const version = formData.get("version")
  const retail_price = Number(formData.get("retail_price"))
  const image = formData.get("image")
  const color = formData.get("color")
  let year: number | null = Number(formData.get("year"))

  if (typeof brand !== "string" || brand.length === 0) {
    return json<ActionData>(
      { errors: { brand: "brand is required" } },
      { status: 400 }
    );
  }

  if (typeof model !== "string" || model.length === 0) {
    return json<ActionData>(
      { errors: { model: "model is required" } },
      { status: 400 }
    );
  }

  if (typeof version !== "string" || version.length === 0) {
    return json<ActionData>(
      { errors: { version: "version is required" } },
      { status: 400 }
    );
  }

  if (isNaN(retail_price) || retail_price <= 0) {
    return json<ActionData>(
      { errors: { retail_price: "retail_price is required and should be above 0" } },
      { status: 400 }
    );
  }

  if (typeof image !== "string" || image.length === 0) {
    return json<ActionData>(
      { errors: { image: "image is required" } },
      { status: 400 }
    );
  }

  if (typeof color !== "string" || color.length === 0) {
    return json<ActionData>(
      { errors: { color: "color is required" } },
      { status: 400 }
    );
  }

  if (isNaN(year) || year < 0) {
    return json<ActionData>(
      { errors: { year: "year is required and should be above 0" } },
      { status: 400 }
    );
  }

  if (year === 0) {
    year = null
  }

  const note = await createCar({ brand, model, version, retail_price, image, color, year });

  return redirect(`/notes/${note.id}`);
};

export default function NewCarPage() {
  const actionData = useActionData() as ActionData;

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <GenericFormInput field="brand" error={actionData?.errors?.brand} />
      <GenericFormInput field="model" error={actionData?.errors?.model} />
      <GenericFormInput field="version" error={actionData?.errors?.version} />
      <GenericFormInput field="retail_price" error={actionData?.errors?.retail_price} />
      <GenericFormInput field="image" error={actionData?.errors?.image} />
      <GenericFormInput field="color" error={actionData?.errors?.color} />
      <GenericFormInput field="year" error={actionData?.errors?.year} />

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
