export default function AnalyticsPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <div className="w-20 h-20 bg-[#fdf7f2] rounded-full flex items-center justify-center text-3xl">📊</div>
      <h1 className="text-2xl font-serif font-bold text-[#4b3b33]">Instagram Analytics</h1>
      <div className="px-4 py-2 bg-[#ead8cd]/30 rounded-full">
        <p className="text-xs font-bold uppercase tracking-widest text-[#b8927c]">Board Coming Soon</p>
      </div>
      <p className="text-sm text-[#7c675b] max-w-xs text-center">
        We are currently integrating the Instagram Graph API to show your engagement metrics here.
      </p>
    </div>
  );
}