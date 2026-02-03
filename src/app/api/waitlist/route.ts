import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    const { name, company, email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 400 });
    }

    if (!name || !company) {
      return NextResponse.json({ error: 'INCOMPLETE_PROFILE' }, { status: 400 });
    }

    // Authenticate with Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID; // Your Google Sheet ID
    const timestamp = new Date().toISOString();

    // Append row to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:D', // Adjust based on your sheet name and columns
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[timestamp, name, company, email]],
      },
    });

    return NextResponse.json({ success: true, message: 'ACCESS_GRANTED' });
  } catch (error) {
    console.error('System Failure:', error);
    return NextResponse.json({ error: 'SYSTEM_FAILURE' }, { status: 500 });
  }
}
