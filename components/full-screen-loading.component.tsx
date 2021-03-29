import React from 'react';
import { Loader } from './';

export default function FullScreenLoading() {
  return (
    <div className="absolute z-10 top-0 left-0 right-0 bottom-0 w-full h-full bg-gray-900 flex items-center justify-center text-white">
      <Loader />
		</div>
  )
}