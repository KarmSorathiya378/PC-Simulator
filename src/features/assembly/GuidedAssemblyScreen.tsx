import React from 'react';
import { GuidedAssemblyScreen as CoreGuidedAssembly } from '../../components/GuidedAssemblyScreen';

/**
 * Assembly Flow Feature Wrapper
 * Enforces zero-horizontal-overflow boundaries and consistent lab layout.
 */
export const GuidedAssemblyScreen: React.FC = () => {
  return (
    <div className="w-full max-w-full overflow-hidden">
      <CoreGuidedAssembly />
    </div>
  );
};

export default GuidedAssemblyScreen;
