/* Animated media panels for each feature card */
export default function FeatureMediaPanel({ type }) {
  switch (type) {
    case 'ai':
      return (
        <div className="w-full max-w-[280px]">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="w-2 h-2 rounded-full bg-green-400" />
            </div>
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-1.5 bg-brand-50 rounded-full px-2.5 py-1 w-fit">
                <span className="text-brand-500 text-xs">✦</span>
                <span className="text-[10px] font-semibold text-brand-700">Microsoft Copilot</span>
              </div>
              <div className="bg-brand-50 rounded-lg px-3 py-2 text-xs text-brand-800 ml-auto w-4/5">
                Schedule a webinar for next Friday at 2 PM
              </div>
              <div className="bg-slate-50 rounded-lg px-3 py-2 text-xs text-slate-600 w-4/5">
                Done! "Q3 Innovation Summit" is live with registration open ✓
              </div>
              <div className="bg-brand-50 rounded-lg px-3 py-2 text-xs text-brand-800 ml-auto w-4/5">
                Add Dr. Smith and send invites to the team
              </div>
              <div className="bg-slate-50 rounded-lg px-3 py-2 text-xs text-slate-600 w-4/5">
                Speaker added, 340 invites sent & calendar blocked ✓
              </div>
            </div>
          </div>
          <div className="text-center mt-2 text-[10px] text-brand-600 font-medium">See it in action →</div>
        </div>
      )

    case 'studio':
      return (
        <div className="w-full max-w-[280px]">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="w-2 h-2 rounded-full bg-green-400" />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-4 mb-4">
                {['📋', '🎨', '🚀'].map((emoji, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${i === 0 ? 'bg-brand-100 ring-2 ring-brand-400' : 'bg-slate-100'}`}>
                      {emoji}
                    </div>
                    {i < 2 && <div className={`w-6 h-0.5 ${i === 0 ? 'bg-brand-300' : 'bg-slate-200'}`} />}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 rounded-full w-4/5" />
                <div className="h-3 bg-slate-100 rounded-full w-3/5" />
                <div className="h-3 bg-slate-100 rounded-full w-2/5" />
              </div>
              <div className="mt-4 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white text-xs font-medium">
                Publish Event
              </div>
            </div>
          </div>
          <div className="text-center mt-2 text-[10px] text-brand-600 font-medium">See it in action →</div>
        </div>
      )

    case 'emails':
      return (
        <div className="w-full max-w-[280px]">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="w-2 h-2 rounded-full bg-green-400" />
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">📧</span>
                <div className="flex-1 space-y-1">
                  <div className="h-2 bg-slate-200 rounded w-3/4" />
                  <div className="h-2 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
              <div className="flex gap-2">
                {[{ val: '94%', lbl: 'Delivered' }, { val: '67%', lbl: 'Opened' }, { val: '42%', lbl: 'Clicked' }].map((s) => (
                  <div key={s.lbl} className="flex-1 bg-brand-50 rounded-lg p-2 text-center">
                    <div className="text-sm font-bold text-brand-700">{s.val}</div>
                    <div className="text-[9px] text-slate-400">{s.lbl}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 bg-amber-50 rounded-lg px-3 py-2">
                <span>🕐</span>
                <span className="text-xs text-amber-700">Best send time: Tue 10:30 AM</span>
              </div>
              <div className="bg-green-50 text-green-600 text-[11px] font-medium px-3 py-1.5 rounded-lg text-center">
                .ics Calendar Blocked ✓
              </div>
            </div>
          </div>
          <div className="text-center mt-2 text-[10px] text-brand-600 font-medium">See it in action →</div>
        </div>
      )

    default:
      return (
        <div className="w-full max-w-[280px]">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="w-2 h-2 rounded-full bg-green-400" />
            </div>
            <div className="p-4 space-y-2">
              <div className="h-3 bg-slate-100 rounded w-4/5" />
              <div className="h-3 bg-slate-100 rounded w-3/5" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
              <div className="h-8 bg-brand-100 rounded-lg mt-3" />
              <div className="h-3 bg-slate-100 rounded w-2/3 mt-2" />
            </div>
          </div>
          <div className="text-center mt-2 text-[10px] text-brand-600 font-medium">See it in action →</div>
        </div>
      )
  }
}
