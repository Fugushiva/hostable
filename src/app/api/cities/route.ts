/**
 * City Search API Route
 * =====================
 * GET /api/cities?countryCode=XX&search=YY
 *
 * Returns a filtered list of cities for the given country.
 * Used by the CityCombobox component for dependent-field logic.
 *
 * Query params:
 * - countryCode (required): ISO2 country code (e.g. "FR", "US")
 * - search (optional): partial city name to filter by
 *
 * Returns: { cities: [{ id: number, name: string }] }
 * Capped at 50 results for performance.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { cities } from "@/db/schema";
import { and, eq, ilike, asc } from "drizzle-orm";

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const countryCode = searchParams.get("countryCode");
    const search = searchParams.get("search");

    if (!countryCode || countryCode.length !== 2) {
        return NextResponse.json(
            { error: "countryCode query parameter is required (ISO2 format)" },
            { status: 400 }
        );
    }

    try {
        // Build filter conditions
        const conditions = [
            eq(cities.countryCode, countryCode.toUpperCase()),
        ];

        if (search && search.trim().length > 0) {
            conditions.push(ilike(cities.name, `${search.trim()}%`));
        }

        const results = await db
            .select({
                id: cities.id,
                name: cities.name,
            })
            .from(cities)
            .where(and(...conditions))
            .orderBy(asc(cities.name))
            .limit(50);

        // Convert BigInt IDs to numbers for JSON serialization
        const serialized = results.map((c) => ({
            id: Number(c.id),
            name: c.name,
        }));

        return NextResponse.json({ cities: serialized });
    } catch (error) {
        console.error("[API /cities] Error fetching cities:", error);
        return NextResponse.json(
            { error: "Failed to fetch cities" },
            { status: 500 }
        );
    }
}
