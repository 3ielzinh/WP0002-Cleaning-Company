"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import { serviceAreas } from "./service-areas";

export default function ServiceAreaMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRefs = useRef<LeafletMarker[]>([]);
  const [activeAreaIndex, setActiveAreaIndex] = useState(0);
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let disposed = false;
    let mapInstance: LeafletMap | null = null;

    const initializeMap = async () => {
      const L = await import("leaflet");
      if (disposed || !mapContainerRef.current) return;

      mapInstance = L.map(mapContainerRef.current, {
        zoomControl: false,
        scrollWheelZoom: false,
        minZoom: 8,
        maxZoom: 15,
        preferCanvas: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);

      L.control.zoom({ position: "bottomright" }).addTo(mapInstance);

      const bounds = L.latLngBounds(serviceAreas.map(area => [...area.coordinates] as [number, number]));

      L.circle(serviceAreas[0].coordinates, {
        radius: 10500,
        color: "#b88724",
        weight: 1,
        opacity: 0.72,
        dashArray: "5 8",
        fillColor: "#e6c76f",
        fillOpacity: 0.09,
        interactive: false,
      }).addTo(mapInstance);

      markerRefs.current = serviceAreas.map((area, index) => {
        const markerIcon = L.divIcon({
          className: `service-map-marker-wrap${area.primary ? " is-primary" : ""}${index === 0 ? " is-active" : ""}`,
          html: '<span class="service-map-marker-core"><span class="service-map-marker-dot"></span></span>',
          iconSize: [34, 42],
          iconAnchor: [17, 35],
          popupAnchor: [0, -31],
        });

        const popup = document.createElement("div");
        popup.className = "service-map-popup";
        const popupLabel = document.createElement("span");
        popupLabel.textContent = area.region;
        const popupName = document.createElement("strong");
        popupName.textContent = area.mapLabel;
        popup.append(popupLabel, popupName);

        const marker = L.marker(area.coordinates, {
          alt: `SparClean service area: ${area.name}`,
          icon: markerIcon,
          keyboard: true,
          riseOnHover: true,
          title: area.name,
        })
          .addTo(mapInstance!)
          .bindPopup(popup, {
            closeButton: false,
            offset: [0, -2],
            autoPanPadding: [24, 24],
          });

        marker.on("click", () => setActiveAreaIndex(index));
        return marker;
      });

      mapInstance.fitBounds(bounds, { padding: [44, 44], maxZoom: 10 });
      mapRef.current = mapInstance;

      requestAnimationFrame(() => {
        if (disposed || !mapInstance) return;
        mapInstance.invalidateSize({ animate: false });
        setMapStatus("ready");
      });
    };

    void initializeMap().catch(() => {
      if (!disposed) setMapStatus("error");
    });

    return () => {
      disposed = true;
      markerRefs.current = [];
      mapRef.current = null;
      mapInstance?.remove();
    };
  }, []);

  useEffect(() => {
    markerRefs.current.forEach((marker, index) => {
      marker.getElement()?.classList.toggle("is-active", index === activeAreaIndex);
    });
  }, [activeAreaIndex, mapStatus]);

  const activeArea = serviceAreas[activeAreaIndex];

  const selectArea = (index: number) => {
    setActiveAreaIndex(index);
    const map = mapRef.current;
    const marker = markerRefs.current[index];
    if (!map || !marker) return;

    map.flyTo(serviceAreas[index].coordinates, serviceAreas[index].primary ? 10 : 12, {
      animate: true,
      duration: 1.05,
      easeLinearity: 0.32,
    });
    marker.openPopup();
  };

  const showAllAreas = () => {
    const map = mapRef.current;
    if (!map) return;
    map.closePopup();
    map.fitBounds(serviceAreas.map(area => [...area.coordinates] as [number, number]), {
      animate: true,
      duration: 0.9,
      padding: [44, 44],
      maxZoom: 10,
    });
  };

  return (
    <section className="service-area-section" id="areas" aria-labelledby="service-area-title">
      <div className="service-area-glow service-area-glow-one" aria-hidden="true"/>
      <div className="service-area-glow service-area-glow-two" aria-hidden="true"/>

      <div className="shell service-area-shell">
        <header className="service-area-heading" data-reveal>
          <div>
            <div className="eyebrow light">Areas we serve</div>
            <h2 id="service-area-title">Local care,<br/><em>beautifully within reach.</em></h2>
          </div>
          <p>SparClean brings meticulous residential and commercial cleaning to Sacramento and the communities that surround it. Select an area to explore our service map.</p>
          <div className="service-area-count" aria-label={`${serviceAreas.length} communities served`}>
            <strong>{serviceAreas.length}</strong>
            <span>communities<br/>one signature standard</span>
          </div>
        </header>

        <div className="service-area-stage" data-reveal>
          <aside className="service-area-directory" aria-label="SparClean service areas">
            <div className="service-area-current" aria-live="polite">
              <span>{activeArea.region}</span>
              <h3>{activeArea.name}</h3>
              <p>Residential and commercial cleaning, thoughtfully tailored to your space and schedule.</p>
            </div>

            <div className="service-area-list" aria-label="Select a community">
              {serviceAreas.map((area, index) => (
                <button
                  className={index === activeAreaIndex ? "active" : ""}
                  key={area.name}
                  type="button"
                  aria-pressed={index === activeAreaIndex}
                  onClick={() => selectArea(index)}
                >
                  <i aria-hidden="true"/>
                  <span>{area.name}</span>
                </button>
              ))}
            </div>

            <a className="service-area-cta" href="#estimate">
              <span>Not sure if your address is covered?</span>
              <strong>Request a tailored estimate <i aria-hidden="true">→</i></strong>
            </a>
          </aside>

          <div className="service-map-frame">
            <div className="service-map-topline">
              <div><i aria-hidden="true"/><span>SparClean service map</span></div>
              <small>Sacramento, California</small>
            </div>

            <div
              className="service-map-canvas"
              ref={mapContainerRef}
              role="region"
              aria-label="Interactive map of SparClean service areas around Sacramento"
            />

            {mapStatus !== "ready" && (
              <div className={`service-map-loading${mapStatus === "error" ? " error" : ""}`} role="status">
                <span aria-hidden="true"/>
                <strong>{mapStatus === "error" ? "Map temporarily unavailable" : "Preparing your service map"}</strong>
                <small>{mapStatus === "error" ? "The complete city list remains available." : "Sacramento and surrounding communities"}</small>
              </div>
            )}

            <div className="service-map-footer">
              <span><i aria-hidden="true"/> Select a city to explore</span>
              <button type="button" onClick={showAllAreas}>View all communities</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
