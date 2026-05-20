import FeatureMediaPanel from './FeatureMediaPanel'

export default function FeatureCard({ feature, index, className = '' }) {
  return (
    <div className={`glass-strong rounded-[20px] overflow-hidden ${className}`}>
      <div className="flex flex-col md:flex-row">
        {/* Media Panel */}
        <div className="md:w-[45%] bg-gradient-to-br from-slate-50 to-brand-50/30 p-4 md:p-6 flex items-center justify-center min-h-[200px] md:min-h-[320px]">
          <FeatureMediaPanel type={feature.mediaType} />
        </div>

        {/* Content Panel */}
        <div className="flex-1 p-5 md:p-8 flex flex-col justify-center">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{feature.icon}</span>
            <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">{feature.eyebrow}</span>
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 leading-tight">{feature.title}</h3>

          {/* Description */}
          <p className="text-sm md:text-base text-slate-500 mb-4 leading-relaxed">{feature.desc}</p>

          {/* Bullets */}
          <ul className="space-y-2">
            {feature.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-brand-500 font-bold mt-0.5">✓</span>
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
