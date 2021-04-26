import React, { FC } from 'react';
import { PopoverContent } from '@grafana/ui';

export interface Props {
  children: React.ReactNode;
  tooltip?: PopoverContent;
  label?: React.ReactNode;
  className?: string;
  noFillEnd?: boolean;
  labelWidth?: number;
}

export const Row: FC<Props> = ({ children, label, tooltip, className, labelWidth, noFillEnd, ...htmlProps }) => {
  return (
    <div className="gf-form">
      {label && <label className={`gf-form-label query-keyword ${className} width-8`}>{label}</label>}
      {children}

      <div className={'gf-form--grow'}>{noFillEnd || <div className={'gf-form-label gf-form-label--grow'}></div>}</div>
    </div>
  );
};

export const Field: FC<Props> = ({ children, label, tooltip, className, labelWidth, noFillEnd, ...htmlProps }) => {
  return (
    <>
      {label && <label className={`gf-form-label query-keyword ${className} width-7`}>{label}</label>}
      {children}
    </>
  );
};

Row.displayName = 'InlineFields';
