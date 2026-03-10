import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const borough = searchParams.get('borough');
  const reservationDifficulty = searchParams.get('reservationDifficulty');

  let query = supabase
    .from('restaurants')
    .select('*')
    .order('created_at', { ascending: false });

  if (borough && borough !== 'All') query = query.eq('borough', borough);
  if (reservationDifficulty && reservationDifficulty !== 'All') {
    query = query.eq('reservation_difficulty', reservationDifficulty);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ restaurants: data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, borough, neighborhood, cuisine, reservationDifficulty, latitude, longitude, createdBy } = body;

  const { data, error } = await supabase
    .from('restaurants')
    .insert({
      name,
      borough,
      neighborhood: neighborhood || null,
      cuisine: cuisine || null,
      reservation_difficulty: reservationDifficulty,
      latitude,
      longitude,
      created_by: createdBy,
    })
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ restaurant: data }, { status: 201 });
}
