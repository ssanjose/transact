'use client';

import { Loader2 } from 'lucide-react';
import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin h-16 w-16" />
    </div>
  );
}

export default Loading;