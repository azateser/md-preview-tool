import { NextResponse } from 'next/server'
import { loadTemplates } from '@/lib/load-templates'

export async function GET() {
  try {
    const templates = loadTemplates()
    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error loading templates:', error)
    return NextResponse.json(
      { error: 'Failed to load templates' },
      { status: 500 }
    )
  }
}