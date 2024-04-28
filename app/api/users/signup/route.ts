import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'
import { sendEmail } from "@/utils/mailer";
const prisma = new PrismaClient();

export default async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json()
    const { email, password } = reqBody
    //validation
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' })
    }
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })
    if (!user) {
      return NextResponse.json({ error: 'User already exists' })
    }
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    })
    console.log(newUser)
    // send verification email
    const mailResponse = await sendEmail([email], 'Email Verification', 'Please verify your email')



  } catch (error) {
    console.error(error)
  }
}


