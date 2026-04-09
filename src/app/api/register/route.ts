import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, username, profileRole } = body;

    if (!name || !email || !password || !username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: existingUser.email === email ? "Email already in use" : "Username already taken" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Set 14-day Pro trial for all new users
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 14);

    const user = await (prisma as any).user.create({
      data: {
        name,
        email,
        username: username.toLowerCase(),
        hashedPassword,
        profileRole: profileRole || "personal_brand",
        plan: "TRIAL",
        trialEndsAt: trialEnd,
        profile: {
          create: {},
        },
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
