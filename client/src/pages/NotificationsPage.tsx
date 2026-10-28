import React from 'react';
import { Bell, AlertTriangle, CheckCircle2, ShieldAlert, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const alerts = [
    {
      id: 'n1',
      title: 'CRITICAL: Bamaloi Drinking Water Shortage Risk at 80.0%',
      description:
        'Shortage likelihood during dry spells has reached 80% (safety threshold 35%). Tube well failure reported; pre-emptive tanker dispatch recommended.',
      severity: 'critical',
      timestamp: '2 hours ago',
      assessmentLink: '/insights',
    },
    {
      id: 'n2',
      title: 'HIGH: PHC Essential Medicine Stock Depletion Warning',
      description:
        'Seasonal diarrhea case incidence in Rengali Block projected to stress ORS packet buffer at Sub-Centre 2.',
      severity: 'high',
      timestamp: 'Yesterday',
      assessmentLink: '/inventory',
    },
    {
      id: 'n3',
      title: 'INFO: Nuapada Irrigation Canal Discharge Observation Recorded',
      description:
        'Field flow meter recorded 12.5 ha-m/month against estimated demand of 22.0 ha-m/month for rabi pulses.',
      severity: 'info',
      timestamp: '3 days ago',
      assessmentLink: '/inventory',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Alerts & Notifications
            </h1>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200/60 shadow-xs">
              Live Monitor
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Real-time automated warnings triggered when shortage risk crosses safety thresholds.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 sm:p-5 rounded-card border transition flex items-start gap-3.5 text-xs shadow-card ${
              alert.severity === 'critical'
                ? 'bg-rose-50/70 border-rose-200'
                : alert.severity === 'high'
                ? 'bg-amber-50/70 border-amber-200'
                : 'surface border-emerald-900/10'
            }`}
          >
            {alert.severity === 'critical' ? (
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            ) : alert.severity === 'high' ? (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <Bell className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-sm">{alert.title}</span>
                <span className="text-[11px] font-mono text-stone-400">{alert.timestamp}</span>
              </div>
              <p className="text-stone-600 leading-relaxed">{alert.description}</p>
              <div className="pt-2">
                <Link
                  to={alert.assessmentLink}
                  className="text-emerald-800 font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
                >
                  <span>Open Risk Insights</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
