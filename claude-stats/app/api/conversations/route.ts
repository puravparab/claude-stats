import { NextResponse } from 'next/server';
import processJson from '@/lib/process_json';

export const revalidate = 300;

export const GET = async () => {
  try {
    const result = processJson();
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }
    if (!result.data) {
      return NextResponse.json(
        { error: 'Internal server error: No data retrieved.' },
        { status: 500 }
      );
    }
    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
};