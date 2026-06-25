"use client";

export type VersionId = "classic" | "tour" | "test" | "boot";

export const VERSIONS: { id: VersionId; label: string }[] = [
  { id: "classic", label: "Classic" },
  { id: "tour", label: "Al's Tour" },
  { id: "test", label: "Spill Test" },
  { id: "boot", label: "Boot Up" },
];

export default function VersionNav({
  version,
  onSelect,
}: {
  version: VersionId;
  onSelect: (v: VersionId) => void;
}) {
  return (
    <nav className="version-nav" aria-label="Preview versions">
      <span className="version-nav-label">PREVIEW</span>
      {VERSIONS.map((v) => (
        <button
          key={v.id}
          className={`version-tab ${version === v.id ? "active" : ""}`}
          onClick={() => onSelect(v.id)}
        >
          {v.label}
        </button>
      ))}
    </nav>
  );
}
