import { NextResponse } from 'next/server';
import { getMarketData } from '@/lib/api';

export const revalidate = 15;

export async function GET() {
  const data = await getMarketData();
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30',
    },
  });
}
