import React from 'react';
import { Bell, AlertTriangle, CheckCircle2, ShieldAlert, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const alerts = [
    {
      id: 'n1',
      title: 'CRITICAL: Bamaloi Potable Water Shortage Probability at 80.0%',
      description:
        'P(Water Shortage | Low Rainfall) has exceeded the 35% preparedness threshold in Bamaloi Gram Panchayat. Immediate dispatch of mobile water tankers recommended.',
      severity: 'critical',
      timestamp: '2 hours ago',
      assessmentLink: '/probability',
    },
    {
      id: 'n2',
      title: 'HIGH: PHC Essential Medicine Stock Depletion Warning',
      description:
        'Seasonal diarrhea case incidence probability in Rengali Block projected to stress ORS packet buffer at Sub-Centre 2.',
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Civic Alerts & Notices</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time automated warnings triggered by mathematical threshold exceedance
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-xl border transition flex items-start gap-3 text-xs ${
              alert.severity === 'critical'
                ? 'bg-red-50/70 border-red-200'
                : alert.severity === 'high'
                ? 'bg-amber-50/70 border-amber-200'
                : 'bg-white border-slate-200'
            }`}
          >
            {alert.severity === 'critical' ? (
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            ) : alert.severity === 'high' ? (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <Bell className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{alert.title}</span>
                <span className="text-[11px] text-slate-400">{alert.timestamp}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{alert.description}</p>
              <div className="pt-2">
                <Link
                  to={alert.assessmentLink}
                  className="text-forest-800 font-semibold hover:underline inline-flex items-center gap-1 text-[11px]"
                >
                  <span>Open Assessment & Audit Trail</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
