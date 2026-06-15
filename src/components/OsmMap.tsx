// Real map via OpenStreetMap embed — no API key required.
// Falls back to a clean framed map even without a Mapbox token.
export function OsmMap({
  lat,
  lng,
  zoom = 14,
  marker = true,
  height = "h-48",
  label,
}: {
  lat: number;
  lng: number;
  zoom?: number;
  marker?: boolean;
  height?: string;
  label?: string;
}) {
  // bbox roughly centred on the point; tighter at higher zoom
  const d = 0.16 / zoom;
  const bbox = `${lng - d * 2},${lat - d},${lng + d * 2},${lat + d}`;
  const src =
    `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik` +
    (marker ? `&marker=${lat},${lng}` : "");

  return (
    <div className={`relative overflow-hidden rounded-2xl ring-1 ring-midnight/10 ${height}`}>
      <iframe
        title="Map"
        src={src}
        loading="lazy"
        className="h-full w-full grayscale-[0.15]"
        style={{ border: 0 }}
      />
      {label && (
        <span className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-white/95 px-3 py-1 text-xs font-medium text-midnight shadow-sm">
          {label}
        </span>
      )}
      <a
        href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`}
        target="_blank"
        rel="noreferrer"
        className="absolute right-3 top-3 rounded-lg bg-white/95 px-3 py-1 text-xs font-semibold text-spree-hover shadow-sm hover:bg-white"
      >
        Open map
      </a>
    </div>
  );
}
