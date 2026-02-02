import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { name, company, email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 400 });
    }

    if (!name || !company) {
       return NextResponse.json({ error: 'INCOMPLETE_PROFILE' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'waitlist.txt');
    const timestamp = new Date().toISOString();
    const entry = `${timestamp} | NAME: ${name} | COMPANY: ${company} | EMAIL: ${email}\n`;

    await fs.promises.appendFile(filePath, entry, 'utf8');

    return NextResponse.json({ success: true, message: 'ACCESS_GRANTED' });
  } catch (error) {
    console.error('System Failure:', error);
    return NextResponse.json({ error: 'SYSTEM_FAILURE' }, { status: 500 });
  }
}
