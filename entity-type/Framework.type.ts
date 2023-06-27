import React from 'react';

import Language from './Language.type';
import FrameworkRenderType from './FrameworkRenderType.type';


export type PROPS = {
  size?: number | string,
  stroke?: number | string,
};

export type Framework = {
  name: string;
  label: string;
  mode: Language;
  types?: FrameworkRenderType[]
  version?: string;
  icon: React.FunctionComponent<PROPS> | null,
}

export default Framework;