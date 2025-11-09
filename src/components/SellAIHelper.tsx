"use client";
import { useState } from "react";
export default function SellAIHelper() {
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string|undefined>(undefined);
  const [suggest, setSuggest] = useState<any>(null);
  async function callAI() {
    setBusy(true); setErr(undefined);
    try {
      const make = (document.querySelector('[name="make"]') as HTMLInputElement)?.value || undefined;
      const model = (document.querySelector('[name="model"]') as HTMLInputElement)?.value || undefined;
      const yearStr = (document.querySelector('[name="year"]') as HTMLInputElement)?.value || undefined;
      const odStr = (document.querySelector('[name="odometerKm"]') as HTMLInputElement)?.value || undefined;
      const hints:any = {}; if (make) hints.make = make; if (model) hints.model = model; if (yearStr) hints.year = Number(yearStr); if (odStr) hints.odometerKm = Number(odStr);
      const res = await fetch("/api/ai/listing-assistant", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ photoUrls, hints }) });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json(); setSuggest(data);
      const map: Record<string, any> = data.extracted || {};
      for (const [k,v] of Object.entries(map)) { const el = document.querySelector(`[name="${k}"]`) as any; if (el && v != null && el.value === "") el.value = String(v); }
      if (data.aiDescription) { const desc = document.querySelector('[name="description"]') as HTMLTextAreaElement | null; if (desc && !desc.value) desc.value = data.aiDescription; }
      if (data.priceSuggestion?.aud) { const price = document.querySelector('[name="price"]') as HTMLInputElement | null; if (price && (!price.value || Number(price.value) === 0)) price.value = String(data.priceSuggestion.aud); }
    } catch(e:any) { setErr(e.message); } finally { setBusy(false); }
  }
  return (
    <div className="card p-4 space-y-3">
      <div className="font-semibold">Generate with AI</div>
      <p className="text-sm text-gray-700">Paste 2–6 photo URLs (from S3 uploader) then click “Auto-fill details”.</p>
      <div className="flex items-center gap-2">
        <input placeholder="Paste photo URL and press Enter" className="border rounded px-3 py-2 w-full"
          onKeyDown={(e)=>{ if (e.key==='Enter'){ e.preventDefault(); const v=(e.target as HTMLInputElement).value.trim(); if (v){ setPhotoUrls(a=>[...a,v]); (e.target as HTMLInputElement).value=""; } } }}/>
        <button type="button" className="btn border" onClick={callAI} disabled={busy || photoUrls.length===0}>{busy ? "Analyzing…" : "Auto-fill details"}</button>
      </div>
      {photoUrls.length>0 && <div className="text-xs text-gray-600">Attached photos: {photoUrls.length}</div>}
      {suggest?.priceSuggestion && (<div className="text-sm"><strong>AI Price:</strong> ${suggest.priceSuggestion.aud.toLocaleString()} <span className="text-gray-600"> (range ${suggest.priceSuggestion.low.toLocaleString()}–${suggest.priceSuggestion.high.toLocaleString()}, conf {Math.round(suggest.priceSuggestion.confidence*100)}%)</span></div>)}
      {err && <div className="text-sm text-red-600">{err}</div>}
    </div>
  );
}
