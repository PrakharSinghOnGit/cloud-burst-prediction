"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { Maximize2 } from "lucide-react";

const DynamicMap = dynamic(
  async () => {
    const L = await import("leaflet");
    const { MapContainer, TileLayer, Marker, Popup, Circle } = await import(
      "react-leaflet"
    );

    return function InnerMap({
      userLocation,
    }: {
      userLocation: [number, number] | null;
    }) {
      const defaultPosition: [number, number] = [28.6139, 77.209];
      const center = userLocation || defaultPosition;

      // Create custom icons
      const userLocationIcon = L.divIcon({
        className: "custom-marker",
        html: '<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const cityCenterIcon = L.divIcon({
        className: "custom-marker",
        html: '<div style="background-color: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      return (
        <MapContainer
          center={center}
          zoom={userLocation ? 15 : 12}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%", borderRadius: 12 }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userLocation && (
            <Marker position={userLocation} icon={userLocationIcon}>
              <Popup>Your Location</Popup>
            </Marker>
          )}
          <Marker position={defaultPosition} icon={cityCenterIcon}>
            <Popup>City center</Popup>
          </Marker>
          <Circle
            center={[28.61, 77.205]}
            radius={1200}
            pathOptions={{ color: "#ef4444", fillOpacity: 0.15 }}
          />
        </MapContainer>
      );
    };
  },
  { ssr: false }
);

export default function MapWidget() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  useEffect(() => {
    setMounted(true);

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.log("Geolocation error:", error);
        }
      );
    }
  }, []);

  return (
    <Card className="w-full h-96">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Map: Rain & Risk Zones</CardTitle>
        <Button
          size="icon"
          variant="outline"
          aria-label="Open map fullscreen"
          onClick={() => setOpen(true)}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="h-80">
        {mounted ? (
          <DynamicMap userLocation={userLocation} />
        ) : (
          <div className="h-full w-full rounded-xl bg-muted" />
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] p-0">
          <DialogHeader className="px-4 pt-4 pb-0">
            <DialogTitle>Map: Rain & Risk Zones</DialogTitle>
          </DialogHeader>
          <div className="h-[85vh] w-full p-4 pt-2">
            {mounted ? (
              <DynamicMap userLocation={userLocation} />
            ) : (
              <div className="h-full w-full rounded-xl bg-muted" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
