"use client";
import { useState } from "react";
export default function Uploader({ onUploaded }:{ onUploaded:(url:string)=>void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string|undefined>(undefined);
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setBusy(true); setError(undefined);
    try {
      const res = await fetch("/api/uploads/presign", { method: "POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ fileName:file.name, fileType:file.type })});
      const { url, fields, key } = await res.json();
      const form = new FormData(); Object.entries(fields).forEach(([k,v])=>form.append(k, v as string)); form.append("file", file);
      const upload = await fetch(url, { method: "POST", body: form });
      if (!upload.ok) throw new Error("Upload failed");
      const publicUrl = `https://${fields.bucket}.s3.${process.env.NEXT_PUBLIC_AWS_REGION||process.env.AWS_REGION}.amazonaws.com/${key}`;
      onUploaded(publicUrl);
    } catch(err:any) { setError(err.message); } finally { setBusy(false); }
  }
  return (<div className="space-y-2"><input type="file" accept="image/*" onChange={handleFile} disabled={busy}/>{busy && <div className="text-sm">Uploading…</div>}{error && <div className="text-sm text-red-600">{error}</div>}</div>);
}
