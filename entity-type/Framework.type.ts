import React from 'react';

import FrameworkName from './FrameworkName.type';
import FrameworkRenderType from './FrameworkRenderType.type';
import Language from './Language.type';


export type PROPS = {
  size?: number | string,
  stroke?: number | string,
};

export type Framework = {
  name: FrameworkName;
  label: string;
  mode: Language;
  types?: FrameworkRenderType[]
  version?: string;
  icon: React.FC<PROPS> | null,
}

export default Framework;