import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const borough = searchParams.get('borough');
  const reservationDifficulty = searchParams.get('reservationDifficulty');

  let query = supabase.from('restaurants').select('*').order('created_at', { ascending: false });

  if (borough && borough !== 'All') query = query.eq('borough', borough);
  if (reservationDifficulty && reservationDifficulty !== 'All') {
    query = query.eq('reservation_difficulty', reservationDifficulty);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ restaurants: data });
}
