"use server";

import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout realizado" });

  response.cookies.set({
    name: "token",
    value: "",
    path: "/",
    maxAge: 0, // remove o cookie
  });

  return response;
}