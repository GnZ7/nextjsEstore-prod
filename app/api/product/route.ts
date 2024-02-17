import prisma from "@/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role != "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { name, description, price, brand, category, inStock, images } = body;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        brand,
        category,
        inStock,
        images,
      },
    });
    return new Response(JSON.stringify(product), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return new Response("Failed to create product", { status: 500 });
  }
}

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role != "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { id, inStock } = body;

  const product = await prisma.product.update({
    where: {
      id: id,
    },
    data: { inStock },
  });

  return new Response(JSON.stringify(product), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
