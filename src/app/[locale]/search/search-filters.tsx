"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type YogaStyle = { id: number; name: string };

function NearMeButton() {
  const [loading, setLoading] = useState(false);

  function handleNearMe() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const params = new URLSearchParams(window.location.search);
        params.set("lat", position.coords.latitude.toFixed(4));
        params.set("lng", position.coords.longitude.toFixed(4));

        const cityInput = document.getElementById("city") as HTMLInputElement;
        if (cityInput) cityInput.placeholder = "📍 Near you";

        setLoading(false);
      },
      () => {
        alert("Could not get your location. Please check browser permissions.");
        setLoading(false);
      }
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-auto p-0 text-xs text-[#7C9082] hover:text-[#6B7D71]"
      onClick={handleNearMe}
      disabled={loading}
    >
      <MapPin className="h-3 w-3 mr-1" />
      {loading ? "Locating..." : "Near Me"}
    </Button>
  );
}

export function SearchFilters({
  currentQuery,
  currentStyle,
  currentDifficulty,
  currentCity,
  styles,
}: {
  currentQuery: string;
  currentStyle: string;
  currentDifficulty: string;
  currentCity: string;
  styles: YogaStyle[];
}) {
  const router = useRouter();

  function applyFilters(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const params = new URLSearchParams();

    const q = formData.get("q") as string;
    const style = formData.get("style") as string;
    const difficulty = formData.get("difficulty") as string;
    const city = formData.get("city") as string;

    // Preserve lat/lng from current URL if present
    const currentParams = new URLSearchParams(window.location.search);
    const lat = currentParams.get("lat");
    const lng = currentParams.get("lng");

    if (q) params.set("q", q);
    if (style) params.set("style", style);
    if (difficulty) params.set("difficulty", difficulty);
    if (city) params.set("city", city);
    if (lat) params.set("lat", lat);
    if (lng) params.set("lng", lng);

    router.push(`/search?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/search");
  }

  return (
    <aside className="w-full md:w-56 shrink-0">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={applyFilters} className="space-y-4">
            {/* Keyword */}
            <div className="space-y-2">
              <Label htmlFor="q">Search</Label>
              <Input
                id="q"
                name="q"
                placeholder="City or studio..."
                defaultValue={currentQuery}
              />
            </div>

            {/* Location with Near Me */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="city">Location</Label>
                <NearMeButton />
              </div>
              <Input
                id="city"
                name="city"
                placeholder="e.g. Hong Kong"
                defaultValue={currentCity}
              />
            </div>

            {/* Style */}
            <div className="space-y-2">
              <Label>Style</Label>
              <Select name="style" defaultValue={currentStyle || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Any style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any style</SelectItem>
                  {styles.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select
                name="difficulty"
                defaultValue={currentDifficulty || undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any level</SelectItem>
                  <SelectItem value="beginner">🌱 Beginner</SelectItem>
                  <SelectItem value="intermediate">🌿 Intermediate</SelectItem>
                  <SelectItem value="advanced">🌳 Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                size="sm"
                className="flex-1 bg-[#7C9082] hover:bg-[#6B7D71]"
              >
                Apply
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearFilters}
              >
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </aside>
  );
}
