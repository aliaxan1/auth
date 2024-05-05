import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'
import { sendEmail } from "@/utils/mailer";
import { v4 as uuidv4 } from 'uuid';
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
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
    if (user) {
      return NextResponse.json({ error: 'User already exists' })
    }
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)
    const userId = uuidv4()

    const newUser = await prisma.user.create({
      data: {
        id: userId,
        email,
        password: hashedPassword
      }
    })
    console.log(newUser)
    // send verification email
    if (newUser) {
      const mailResponse = await sendEmail(newUser, 'VERIFICATION')
      console.log(mailResponse)
      return NextResponse.json({ message: 'User created successfully' })
      }



  } catch (error) {
    console.error(error)
  }
}


