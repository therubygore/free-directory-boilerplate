import { getAirtableListings } from "@/lib/airtable";
import { NextRequest, NextResponse } from "next/server";
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_TOKEN }).base(process.env.AIRTABLE_BASE_ID!);
const tableName = process.env.AIRTABLE_TABLE_NAME || 'Listings';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Submit listing API called with:', body);

    const { name, website, instagram, bookingUrl, email, description, category, userId } = body;

    // Create slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Create record in Airtable
    const record = await base(tableName).create({
      'Name': name,
      'Slug': slug,
      'Description': description,
      'Website': website || '',
      'Instagram': instagram || '',
      'Booking URL': bookingUrl || '',
      'Email': email || '',
      'Category': category,
      'Status': 'Review', // Start in review status
      'Locale': 'en',
      'Featured': false,
    });

    console.log('Created record:', record.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Listing submitted successfully!',
      recordId: record.id 
    });

  } catch (error) {
    console.error('Error submitting listing:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit listing' },
      { status: 500 }
    );
  }
}