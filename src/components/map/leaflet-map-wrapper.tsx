'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';

// Define interfaces for type safety
interface LeafletMapProps {
  center: [number, number];
  zoom: number;
  jobs: Array<{
    id: string;
    title: string;
    location: {
      lat: number;
      lng: number;
      address: string;
    };
    urgency: 'urgent' | 'high' | 'medium' | 'low';
    price: number;
    provider: {
      name: string;
      rating: number;
      avatar: string;
    };
  }>;
  onJobSelect?: (job: any) => void;
  userLocation?: [number, number] | null;
  searchRadius?: number;
}

interface LeafletComponents {
  MapContainer: any;
  TileLayer: any;
  Marker: any;
  Popup: any;
  Circle: any;
}

interface LeafletInstance {
  divIcon: (options: any) => any;
  icon: (options: any) => any;
}

const LeafletMapComponent = ({ 
  center, 
  zoom, 
  jobs, 
  onJobSelect, 
  userLocation, 
  searchRadius = 10 
}: LeafletMapProps) => {
  const [leafletComponents, setLeafletComponents] = useState<LeafletComponents | null>(null);
  const [leafletInstance, setLeafletInstance] = useState<LeafletInstance | null>(null);
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef<any>(null);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load Leaflet components dynamically
  useEffect(() => {
    if (!isClient) return;

    const loadLeaflet = async () => {
      try {
        // Import all Leaflet dependencies
        const [reactLeaflet, leaflet] = await Promise.all([
          import('react-leaflet'),
          import('leaflet')
        ]);

        // Fix Leaflet default icon issue
        delete (leaflet as any).Icon.Default.prototype._getIconUrl;
        leaflet.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        setLeafletComponents({
          MapContainer: reactLeaflet.MapContainer,
          TileLayer: reactLeaflet.TileLayer,
          Marker: reactLeaflet.Marker,
          Popup: reactLeaflet.Popup,
          Circle: reactLeaflet.Circle,
        });

        setLeafletInstance(leaflet);
      } catch (error) {
        console.error('Failed to load Leaflet:', error);
      }
    };

    loadLeaflet();
  }, [isClient]);

  // Create custom marker icon
  const createCustomIcon = useMemo(() => {
    if (!leafletInstance || !isClient) return null;

    return (urgency: string) => {
      const urgencyColors = {
        urgent: '#ef4444',
        high: '#f97316',
        medium: '#eab308',
        low: '#10b981'
      };

      return leafletInstance.divIcon({
        className: 'custom-gig-marker',
        html: `
          <div style="
            background-color: ${urgencyColors[urgency as keyof typeof urgencyColors]};
            border: 3px solid white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: transform 0.2s;
          " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
            <div style="
              background-color: white;
              border-radius: 50%;
              width: 12px;
              height: 12px;
            "></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      });
    };
  }, [leafletInstance, isClient]);

  // Don't render anything until client-side and components are loaded
  if (!isClient || !leafletComponents || !leafletInstance) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading interactive map...</p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, Circle } = leafletComponents;

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User location circle */}
        {userLocation && (
          <Circle
            center={userLocation}
            radius={searchRadius * 1000} // Convert km to meters
            fillColor="blue"
            fillOpacity={0.1}
            color="blue"
            weight={2}
          />
        )}

        {/* Job markers */}
        {jobs.map((job) => (
          <Marker
            key={job.id}
            position={[job.location.lat, job.location.lng]}
            icon={createCustomIcon?.(job.urgency)}
            eventHandlers={{
              click: () => onJobSelect?.(job),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-3 min-w-[250px]">
                <div className="flex items-start gap-3">
                  <img
                    src={job.provider.avatar}
                    alt={job.provider.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      by {job.provider.name}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span>{job.provider.rating}</span>
                      </div>
                      <div className="font-semibold text-green-600">
                        ${job.price}
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        job.urgency === 'urgent' ? 'bg-red-100 text-red-800' :
                        job.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                        job.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {job.urgency} priority
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Custom CSS for markers */}
      <style jsx>{`
        .custom-gig-marker {
          background: transparent !important;
          border: none !important;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
};

// Export as dynamic component to prevent SSR issues
export const LeafletMapWrapper = dynamic(
  () => Promise.resolve(LeafletMapComponent),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading interactive map...</p>
        </div>
      </div>
    )
  }
);

export default LeafletMapWrapper;
