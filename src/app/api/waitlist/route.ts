import { NextResponse } from 'next/server';

// Your Sheet.best URL
const SHEET_BEST_URL = 'https://api.sheetbest.com/sheets/19402277-d48e-4cb3-b884-2689be966458';

export async function POST(request: Request) {
  try {
    console.log('📡 Waitlist API called at:', new Date().toISOString());
    
    // Parse the request body
    const { name, company, email } = await request.json();
    console.log('📦 Data received:', { name, company, email });

    // Validation
    if (!email || !email.includes('@')) {
      console.log('❌ Invalid email:', email);
      return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 400 });
    }

    if (!name || !company) {
      console.log('❌ Missing fields:', { name, company });
      return NextResponse.json({ error: 'INCOMPLETE_PROFILE' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    
    // Prepare data for Google Sheets
    const sheetData = {
      timestamp: timestamp,
      name: name,
      company: company,
      email: email
    };
    
    console.log('📤 Sending to Google Sheets:', sheetData);
    
    // Send data to Google Sheets via Sheet.best
    const response = await fetch(SHEET_BEST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sheetData),
    });

    const sheetResponse = await response.json();
    console.log('📥 Google Sheets response:', sheetResponse);

    if (!response.ok) {
      console.error('❌ Failed to save to Google Sheets:', sheetResponse);
      throw new Error('Failed to save to Google Sheets');
    }

    console.log('✅ Successfully saved to Google Sheets');
    
    return NextResponse.json({ 
      success: true, 
      message: 'ACCESS_GRANTED',
      timestamp: timestamp
    }, { status: 201 });

  } catch (error) {
    console.error('💥 System Failure:', error);
    return NextResponse.json({ 
      error: 'SYSTEM_FAILURE',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Optional: GET endpoint to view all entries
export async function GET() {
  try {
    const response = await fetch(SHEET_BEST_URL);
    const data = await response.json();
    
    return NextResponse.json({ 
      count: data.length,
      data: data 
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch data'
    }, { status: 500 });
  }
}
