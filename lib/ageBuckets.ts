export type AgeBucket = {  
  id: string;        // '0-3m', '2-3y', etc.  
  label: string;     // '0–3 months'  
  group: 'baby' | 'toddler' | 'kid';  
};
  
export const AGE_BUCKETS: AgeBucket[] = [  
  // Baby (months)  
  { id: '0-3m',   label: '0–3 months',   group: 'baby' },  
  { id: '3-6m',   label: '3–6 months',   group: 'baby' },  
  { id: '6-12m',  label: '6–12 months',  group: 'baby' },
  
  // Toddler  
  { id: '12-18m', label: '12–18 months', group: 'toddler' },  
  { id: '18-24m', label: '18–24 months', group: 'toddler' },  
  { id: '2-3y',   label: '2–3 years',    group: 'toddler' },  
  { id: '3-4y',   label: '3–4 years',    group: 'toddler' },
  
  // Kids  
  { id: '4-5y',   label: '4–5 years',    group: 'kid' },  
  { id: '5-6y',   label: '5–6 years',    group: 'kid' },  
  { id: '6-7y',   label: '6–7 years',    group: 'kid' },  
  { id: '7-8y',   label: '7–8 years',    group: 'kid' },  
  { id: '8-9y',   label: '8–9 years',    group: 'kid' },  
  { id: '9-10y',  label: '9–10 years',   group: 'kid' },  
  { id: '11-12y', label: '11–12 years',  group: 'kid' },  
  { id: '12-13y', label: '12–13 years',  group: 'kid' },  
  { id: '13-14y', label: '13–14 years',  group: 'kid' },  
  { id: '14-15y', label: '14–15 years',  group: 'kid' },  
  { id: '15-16y', label: '15–16 years',  group: 'kid' },  
];  