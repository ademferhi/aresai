import { NextResponse } from 'next/server';
import { AresEngine } from '@/lib/ai/engine';

export async function POST(request: Request) {
  try {
    const { input } = await request.json();

    if (!input) {
      return NextResponse.json({ error: 'No input provided' }, { status: 400 });
    }

    const engine = new AresEngine();
    const result = await engine.analyze(input);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analysis Error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
