"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { MapPin } from "lucide-react";
import { HK_REGIONS, HK_DISTRICTS, type Region } from "@/lib/hk-districts";

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
        routerPush(params);
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

function routerPush(params: URLSearchParams) {
  const qs = params.toString();
  window.location.href = `/search${qs ? `?${qs}` : ""}`;
}

export function SearchFilters({
  currentQuery,
  currentStyle,
  currentDifficulty,
  currentRegion,
  currentDistrict,
  currentDate,
  styles,
}: {
  currentQuery: string;
  currentStyle: string;
  currentDifficulty: string;
  currentRegion: string;
  currentDistrict: string;
  currentDate: string;
  styles: YogaStyle[];
}) {
  const [region, setRegion] = useState<string>(currentRegion);
  const [district, setDistrict] = useState<string>(currentDistrict);

  function applyFilters(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const params = new URLSearchParams();

    const q = formData.get("q") as string;
    const style = formData.get("style") as string;
    const difficulty = formData.get("difficulty") as string;
    const r = formData.get("region") as string;
    const d = formData.get("district") as string;
    const date = formData.get("date") as string;

    if (q) params.set("q", q);
    if (style && style !== "all") params.set("style", style);
    if (difficulty && difficulty !== "all") params.set("difficulty", difficulty);
    if (r && r !== "all") params.set("region", r);
    if (d && d !== "all") params.set("district", d);
    if (date) params.set("date", date);

    // Preserve lat/lng
    const currentParams = new URLSearchParams(window.location.search);
    const lat = currentParams.get("lat");
    const lng = currentParams.get("lng");
    if (lat) params.set("lat", lat);
    if (lng) params.set("lng", lng);

    routerPush(params);
  }

  function clearFilters() {
    window.location.href = "/search";
  }

  const districts = region && region !== "all" ? HK_DISTRICTS[region as Region] ?? [] : [];

  return (
    <aside className="w-full md:w-64 shrink-0">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={applyFilters} className="space-y-4">
            {/* Keyword */}
            <div className="space-y-1.5">
              <Label htmlFor="q" className="text-xs">Search</Label>
              <Input
                id="q"
                name="q"
                placeholder="Studio or class name..."
                defaultValue={currentQuery}
                className="h-9 text-sm"
              />
            </div>

            {/* Region */}
            <div className="space-y-1.5">
              <Label className="text-xs">Region</Label>
              <Select
                name="region"
                defaultValue={currentRegion || undefined}
                onValueChange={(v) => {
                  setRegion(v ?? "");
                  setDistrict("");
                }}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="All regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All regions</SelectItem>
                  {HK_REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* District (depends on region) */}
            <div className="space-y-1.5">
              <Label className="text-xs">District</Label>
              <Select
                name="district"
                defaultValue={currentDistrict || undefined}
                disabled={!region || region === "all"}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder={
                    !region || region === "all"
                      ? "Pick a region first"
                      : "All districts"
                  } />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All districts</SelectItem>
                  {districts.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <Label htmlFor="date" className="text-xs">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={currentDate}
                className="h-9 text-sm"
              />
            </div>

            {/* Style */}
            <div className="space-y-1.5">
              <Label className="text-xs">Style</Label>
              <Select name="style" defaultValue={currentStyle || undefined}>
                <SelectTrigger className="h-9 text-sm">
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
            <div className="space-y-1.5">
              <Label className="text-xs">Difficulty</Label>
              <Select
                name="difficulty"
                defaultValue={currentDifficulty || undefined}
              >
                <SelectTrigger className="h-9 text-sm">
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

            {/* Near Me */}
            <div className="flex items-center justify-between pt-1">
              <NearMeButton />
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
