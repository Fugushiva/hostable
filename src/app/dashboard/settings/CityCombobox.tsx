/**
 * CityCombobox Component
 * ======================
 * A searchable combobox for selecting a city, filtered by country.
 *
 * Features:
 * - Debounced API calls (300ms) to /api/cities
 * - Keyboard navigation (ArrowUp/Down, Enter, Escape)
 * - Click-outside to close dropdown
 * - Resets when countryCode changes
 * - Hidden input for form submission (cityId)
 * - Disabled state when no country is selected
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface City {
    id: number;
    name: string;
}

interface CityComboboxProps {
    countryCode: string;
    initialCityId?: number;
    initialCityName?: string;
    hasError?: boolean;
}

export default function CityCombobox({
    countryCode,
    initialCityId,
    initialCityName,
    hasError,
}: CityComboboxProps) {
    const [query, setQuery] = useState(initialCityName || "");
    const [selectedId, setSelectedId] = useState<number | null>(
        initialCityId ?? null
    );
    const [cities, setCities] = useState<City[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const prevCountryCode = useRef(countryCode);

    // Reset when country changes
    useEffect(() => {
        if (prevCountryCode.current !== countryCode) {
            setQuery("");
            setSelectedId(null);
            setCities([]);
            setIsOpen(false);
            prevCountryCode.current = countryCode;
        }
    }, [countryCode]);

    // Fetch cities with debounce
    const fetchCities = useCallback(
        (searchQuery: string) => {
            if (!countryCode) return;

            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            debounceRef.current = setTimeout(async () => {
                setIsLoading(true);
                try {
                    const params = new URLSearchParams({ countryCode });
                    if (searchQuery.trim()) {
                        params.set("search", searchQuery.trim());
                    }
                    const res = await fetch(`/api/cities?${params}`);
                    if (res.ok) {
                        const data = await res.json();
                        setCities(data.cities || []);
                        setIsOpen(true);
                        setHighlightedIndex(-1);
                    }
                } catch (err) {
                    console.error("Failed to fetch cities:", err);
                } finally {
                    setIsLoading(false);
                }
            }, 300);
        },
        [countryCode]
    );

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        setSelectedId(null);
        fetchCities(value);
    };

    // Handle city selection
    const selectCity = (city: City) => {
        setQuery(city.name);
        setSelectedId(city.id);
        setIsOpen(false);
        setCities([]);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || cities.length === 0) {
            if (e.key === "ArrowDown" && query.length > 0) {
                fetchCities(query);
            }
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setHighlightedIndex((prev) =>
                    prev < cities.length - 1 ? prev + 1 : 0
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex((prev) =>
                    prev > 0 ? prev - 1 : cities.length - 1
                );
                break;
            case "Enter":
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < cities.length) {
                    selectCity(cities[highlightedIndex]);
                }
                break;
            case "Escape":
                setIsOpen(false);
                break;
        }
    };

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle focus – show initial cities
    const handleFocus = () => {
        if (countryCode && !selectedId) {
            fetchCities(query);
        }
    };

    const isDisabled = !countryCode;

    return (
        <div className="combobox-container">
            {/* Hidden input for form submission */}
            <input type="hidden" name="cityId" value={selectedId ?? ""} />

            {/* Visible search input */}
            <div className="combobox-input-wrapper">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    placeholder={
                        isDisabled ? "Select a country first" : "Search for a city…"
                    }
                    disabled={isDisabled}
                    className={`form-input combobox-input ${hasError ? "input-error" : ""}`}
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    id="city-search"
                />
                {isLoading && (
                    <div className="combobox-spinner">
                        <span className="spinner small" />
                    </div>
                )}
                {selectedId && !isLoading && (
                    <div className="combobox-check">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#16a34a"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Dropdown list */}
            {isOpen && cities.length > 0 && (
                <div
                    ref={dropdownRef}
                    className="combobox-dropdown"
                    role="listbox"
                >
                    {cities.map((city, index) => (
                        <button
                            key={city.id}
                            type="button"
                            className={`combobox-option ${index === highlightedIndex ? "highlighted" : ""
                                } ${city.id === selectedId ? "selected" : ""}`}
                            onClick={() => selectCity(city)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                            role="option"
                            aria-selected={city.id === selectedId}
                        >
                            {city.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {isOpen && cities.length === 0 && !isLoading && query.length > 0 && (
                <div ref={dropdownRef} className="combobox-dropdown">
                    <div className="combobox-empty">No cities found</div>
                </div>
            )}
        </div>
    );
}
