"use client";
  
import * as React from "react";
  
function normalizeAgeMonths(input: number[]) {  
  const cleaned = (input ?? [])  
    .map((n) => Number(n))  
    .filter((n) => Number.isFinite(n))  
    .map((n) => Math.round(n))  
    .filter((n) => n >= 0 && n <= 216); // 0..18 years safety  
  return Array.from(new Set(cleaned)).sort((a, b) => a - b);  
}
  
function parseNumberList(raw: string) {  
  // Allows: "12,18" or "12 18" or "12, 18"  
  return (raw ?? "")  
    .split(/[,\s]+/)  
    .map((s) => s.trim())  
    .filter(Boolean)  
    .map((s) => Number(s))  
    .filter((n) => Number.isFinite(n));  
}
  
function yearsToMonths(years: number[]) {  
  return years.map((y) => Math.round(y * 12));  
}
  
export function formatAgeFromMonths(months: number) {  
  if (months < 12) return `${months}M`;  
  const y = Math.floor(months / 12);  
  const m = months % 12;  
  return m === 0 ? `${y}Y` : `${y}Y ${m}M`;  
}
  
/**  
 * Recomputes canonical age_months[] from 2 admin text inputs.  
 * - monthPointsText: "12,18"  
 * - yearPointsText: "2,3,4,5,6,7,10,11,13"  
 */  
function computeAgeMonths(monthPointsText: string, yearPointsText: string) {  
  const monthPoints = parseNumberList(monthPointsText);  
  const yearPoints = parseNumberList(yearPointsText);  
  return normalizeAgeMonths([...monthPoints, ...yearsToMonths(yearPoints)]);  
}
  
export type AgeAdminValue = {  
  age_months: number[]; // canonical months to save in DB  
  age_month_points_text: string;  
  age_year_points_text: string;  
};
  
export function AgeAdminPicker({  
  value,  
  onChange,  
  className,  
}: {  
  value: AgeAdminValue;  
  onChange: (next: AgeAdminValue) => void;  
  className?: string;  
}) {  
  const monthsText = value.age_month_points_text ?? "";  
  const yearsText = value.age_year_points_text ?? "";
  
  return (  
    <div className={className}>  
      <label className="mb-1.5 block text-[11px] font-bold uppercase text-[#a07d68]">  
        Sizes (Age)  
      </label>
  
      <div className="rounded-2xl border border-[#ead8cd] bg-[#fdf7f2] p-4 space-y-4">  
        {/* Months points */}  
        <div>  
          <div className="text-[11px] font-bold text-[#4b3b33]">  
            Months boundary points  
          </div>  
          <div className="text-[11px] text-gray-600">  
            Example: <span className="font-mono">12,18</span> → "12–18 months"  
          </div>
  
          <input  
            type="text"  
            inputMode="numeric"  
            value={monthsText}  
            onChange={(e) => {  
              const nextText = e.target.value;  
              onChange({  
                ...value,  
                age_month_points_text: nextText,  
              });  
            }}  
            onBlur={() => {  
              onChange({  
                ...value,  
                age_months: computeAgeMonths(monthsText, yearsText),  
              });  
            }}  
            className="mt-2 w-full rounded-xl border border-[#ead8cd] bg-white p-3 text-sm"  
            placeholder="12,18"  
          />  
        </div>
  
        {/* Years points */}  
        <div>  
          <div className="text-[11px] font-bold text-[#4b3b33]">  
            Years boundary points  
          </div>  
          <div className="text-[11px] text-gray-600">  
            Example:{" "}  
            <span className="font-mono">2,3,4,5,6,7,10,11,13</span> → saved as  
            24,36,48...  
          </div>
  
          <input  
            type="text"  
            inputMode="numeric"  
            value={yearsText}  
            onChange={(e) => {  
              const nextText = e.target.value;  
              onChange({  
                ...value,  
                age_year_points_text: nextText,  
              });  
            }}  
            onBlur={() => {  
              onChange({  
                ...value,  
                age_months: computeAgeMonths(monthsText, yearsText),  
              });  
            }}  
            className="mt-2 w-full rounded-xl border border-[#ead8cd] bg-white p-3 text-sm"  
            placeholder="2,3,4,5,6,7,10,11,13"  
          />  
        </div>
  
        {/* Buttons */}  
        <div className="flex flex-wrap gap-2">  
          <button  
            type="button"  
            onClick={() => {  
              const presetMonths = "12,18";  
              const presetYears = "2,3,4,5,6,7,10,11,13";  
              onChange({  
                age_month_points_text: presetMonths,  
                age_year_points_text: presetYears,  
                age_months: computeAgeMonths(presetMonths, presetYears),  
              });  
            }}  
            className="rounded-xl border border-[#ead8cd] bg-white px-3 py-2 text-xs font-bold text-[#4b3b33] hover:bg-[#fff7f0]"  
          >  
            Use your standard preset  
          </button>
  
          <button  
            type="button"  
            onClick={() => {  
              onChange({  
                age_month_points_text: "",  
                age_year_points_text: "",  
                age_months: [],  
              });  
            }}  
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100"  
          >  
            Clear  
          </button>
  
          <button  
            type="button"  
            onClick={() => {  
              // manual recompute (in case admin doesn't blur)  
              onChange({  
                ...value,  
                age_months: computeAgeMonths(monthsText, yearsText),  
              });  
            }}  
            className="rounded-xl bg-[#4b3b33] px-3 py-2 text-xs font-bold text-white"  
          >  
            Update sizes  
          </button>  
        </div>
  
        {/* Preview */}  
        <div className="rounded-xl border border-[#ead8cd] bg-white p-3">  
          <div className="text-[11px] font-bold text-[#4b3b33]">  
            Saved to DB as <span className="font-mono">age_months</span>  
          </div>  
          <div className="mt-2 text-xs font-mono text-gray-700 break-words">  
            {JSON.stringify(normalizeAgeMonths(value.age_months))}  
          </div>
  
          <div className="mt-2 text-[11px] text-gray-600">  
            Labels preview:{" "}  
            <span className="font-semibold text-[#4b3b33]">  
              {normalizeAgeMonths(value.age_months).length  
                ? normalizeAgeMonths(value.age_months)  
                    .map(formatAgeFromMonths)  
                    .join(", ")  
                : "None"}  
            </span>  
          </div>  
        </div>  
      </div>  
    </div>  
  );  
}  