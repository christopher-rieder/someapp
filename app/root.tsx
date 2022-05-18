import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Form,
  NavLink,
  useLoaderData
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import sharedCss from "./styles/shared.css";
import { getUser, requireUserId } from "./session.server";
import { useOptionalUser } from "./utils";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: sharedCss }
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

type ItemMenu = {
  label: string,
  slug: string,
  icon: string,
}

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  sidebarData: Array<ItemMenu>;
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  const sidebarData = [
    { icon: '', slug: 'cars', label: 'Cars' },
    { icon: '', slug: 'financing', label: 'Financing' },
    { icon: '', slug: 'promotions', label: 'Promotions' },
    { icon: '', slug: 'budget', label: 'Budget' },
  ]
  return json<LoaderData>({
    user: await getUser(request),
    sidebarData,
  });
};

function Sidebar() {
  const { sidebarData } = useLoaderData();
  return (
    <div className="h-full w-60 border-r sidebar">
      <NavLink to='/'>
        <img src="/logo.svg" alt="company logo" />
      </NavLink>
      <hr />
      {
        sidebarData.map((menuItem: ItemMenu) => (
          <NavLink key={menuItem.slug} to={menuItem.slug} className="nav-link block p-4 text-xl text-blue-500">
            {menuItem.label}
          </NavLink>
        ))
      }
      <Form action="/logout" method="post">
        <button
          type="submit"
          className="block p-4 text-xl text-blue-500"
        >
          Logout
        </button>
      </Form>
    </div>
  )
}

export default function App() {
  const user = useOptionalUser()
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        {Boolean(user) ? (
          <main className="flex h-full bg-white">
            <Sidebar />
            <div className="flex-1">
              <Outlet />
            </div>
          </main>
        ) : (
          <Outlet />
        )}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export const unstable_shouldReload = () => false;
