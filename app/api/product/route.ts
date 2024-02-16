import prisma from "@/libs/prismadb";
import React from "react";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { Product } from "@prisma/client";

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role != "ADMIN") {
    return NextResponse.error;
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
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.error;
  }
}

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role != "ADMIN") {
    return NextResponse.error();
  }

  const body = await request.json();
  const { id, inStock } = body;

  const product = await prisma.product.update({
    where: {
      id: id,
    },
    data: { inStock },
  });

  return NextResponse.json(product);
}
