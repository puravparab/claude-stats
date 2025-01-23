import { join } from 'path';
import { readFileSync } from 'fs';
import { NextResponse } from 'next/server';

export const revalidate = 300;

export const GET = async () => {
  try {
    const currentDir = process.cwd();
    const filePath = join(currentDir, '../data/conversations.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    const parsedContent = JSON.parse(fileContent);
    return NextResponse.json(parsedContent);
  } catch (error: any) {
    console.error('Error reading file:', error);
    return NextResponse.json(
      { error: 'Failed to load conversations data' }, 
      { status: 500 }
    );
  }
}