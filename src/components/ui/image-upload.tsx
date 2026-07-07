"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, X } from "lucide-react";

import { cn } from "@/lib/cn";

interface ImageUploadProps {
  folder: "profiles/avatars" | "organizations/logos";
  value?: string | null;
  onChange: (url: string | null) => void;
  shape?: "circle" | "square";
  fallbackIcon?: React.ReactNode;
}

export function ImageUpload({ folder, value, onChange, shape = "circle", fallbackIcon }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("folder", folder);

      const res = await fetch("/api/uploads/image", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Erro ao enviar imagem");
      }

      setPreview(data.url);
      onChange(data.url);
    } catch (err) {
      setPreview(value ?? null);
      setError(err instanceof Error ? err.message : "Erro ao enviar imagem");
    } finally {
      setIsUploading(false);
    }
  }

  function handleRemove() {
    setPreview(null);
    setError(null);
    onChange(null);
  }

  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-2xl";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className={cn(
            "grid size-28 place-items-center overflow-hidden border-2 border-dashed border-border bg-muted text-muted-foreground transition hover:border-muted-foreground/40 disabled:cursor-not-allowed",
            shapeClass,
          )}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Pré-visualização" className="size-full object-cover" />
          ) : (
            fallbackIcon ?? <Camera className="size-7" />
          )}

          {isUploading && (
            <div className="absolute inset-0 grid place-items-center bg-white/70">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </button>

        {preview && !isUploading && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-slate-900 text-white"
          >
            <X className="size-3.5" />
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="text-sm font-semibold text-primary transition hover:opacity-80 disabled:opacity-50"
      >
        {preview ? "Trocar foto" : "Escolher foto"}
      </button>

      {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
}
