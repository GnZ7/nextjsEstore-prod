import { getCurrentUserAndOrders } from "@/actions/getCurrentUser";
import { Review } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const currentUser = await getCurrentUserAndOrders();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { comment, rating, product, userId } = body;

  /* Traer ordenes y filtrar las que tienen el productId que está en el request
  y ya fué entregada */
  const orderDelivered = currentUser?.orders.some(
    (order) =>
      order.products.find((item) => item.id === product.id) &&
      order.deliveryStatus === "delivered"
  );

  //Chequear si el usuario ya hizo una reseña del producto o si ya fué entregado
  const userReviewedProduct = product?.reviews.find((review: Review) => {
    return review.userId === currentUser.id;
  });
  if (userReviewedProduct || !orderDelivered) {
    return NextResponse.error();
  }

  const review = await prisma?.review.create({
    data: {
      comment,
      rating,
      productId: product.id,
      userId,
    },
  });

  return NextResponse.json(review);
}
