import React from 'react';

export type PROPS = {
  size?: number | string,
  stroke?: number | string,
};

export type Framework = {
  name: string;
  label: string;
  mode: string;
  types?: any[]
  version?: string;
  icon: React.FunctionComponent<PROPS> | null,
}

export default Framework;