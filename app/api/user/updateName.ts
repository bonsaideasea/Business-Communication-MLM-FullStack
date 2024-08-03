//app\api\user\updateName.ts

import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import { currentUser } from "@/lib/current-user";

export async function PUT(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { name } = await request.json();

    // Update the user name
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Failed to update user name:", error);
    return NextResponse.json(
      { error: "Failed to update user name" },
      { status: 500 }
    );
  }
}
