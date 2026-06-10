import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  const clerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const supabaseConfigured = !!supabase;

  return NextResponse.json({
    status: clerkConfigured && supabaseConfigured ? 'healthy' : 'degraded',
    clerk: {
      available: clerkConfigured,
    },
    supabase: {
      available: supabaseConfigured,
    },
  });
}
