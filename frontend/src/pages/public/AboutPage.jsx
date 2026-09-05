import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, HeartHandshake, TrendingDown, Users, Leaf } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-3 py-1 rounded-full">
          Our Purpose & Mission
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 font-serif">
          Decentralizing Agriculture, Empowering Growers
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Krishi Market was conceived to address one of the greatest economic inefficiencies in food production: the massive gap between what consumers pay and what farmers receive.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900 font-serif">The Crisis in Traditional Mandi Supply Chains</h2>
          <p>
            In conventional agricultural marketing across India, smallholder farmers are often compelled to sell perishable crops immediately after harvest to commission agents at prevailing wholesale APMC rates. During peak harvest seasons, artificial oversupply forces prices down to distress levels.
          </p>
          <p>
            By the time that same tomato or cauliflower arrives on city grocery shelves 5 to 7 days later, multiple logistics agents, transport cartels, and retail distributors have marked the price up by 200% to 400%, while the crop has lost its natural nutritional vitality.
          </p>
        </div>

        <div className="bg-forest-950 text-white p-8 rounded-3xl space-y-6">
          <h3 className="text-xl font-bold font-serif text-harvest-400">The Krishi Market Core Principles</h3>
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <ShieldCheck size={20} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Full Land & Origin Verification:</strong>
                <span className="text-slate-300">Every grower must prove verified agricultural holdings. No anonymous wholesale relabeling allowed.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HeartHandshake size={20} className="text-harvest-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Fair Farmgate Realization:</strong>
                <span className="text-slate-300">Farmers retain 85%+ of the gross transaction value, transforming farming into a sustainable family enterprise.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Leaf size={20} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Radical Transparency:</strong>
                <span className="text-slate-300">Consumers know the exact harvest date, chemical residue testing status, and soil practices behind every meal.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};