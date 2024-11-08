import React from 'react';
import { hikingTemplate } from './hikingtemplate';
import { hikes } from './hikes';

export const HikingSection = () => {
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Hiking Trips</h2>
        <div className="overflow-x-auto pb-6">
          <div className="flex space-x-4">
            {hikes.map((hike, index) => (
              <hikingTemplate key={index} hike={hike} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
