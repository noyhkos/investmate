import { NextResponse } from "next/server";

import * as uipin from "uipin/next";

// The picker is mounted in development only; the route it writes through has
// to disappear with it rather than sit on a public deployment.
const DEV = process.env.NODE_ENV === "development";
const gone = () => NextResponse.json({ error: "Not found" }, { status: 404 });

export const GET = DEV ? uipin.GET : gone;
export const PUT = DEV ? uipin.PUT : gone;
export const DELETE = DEV ? uipin.DELETE : gone;
