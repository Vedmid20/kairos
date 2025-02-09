import { NextResponse } from 'next/server';

let tempUserData: any = null;

export async function POST(req: Request) {
  try {
    const data = await req.json();
    tempUserData = data;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error processing request' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json(tempUserData);
}
