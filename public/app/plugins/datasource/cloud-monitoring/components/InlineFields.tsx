import React, { FC } from 'react';
import { HorizontalGroup, InlineLabel, PopoverContent } from '@grafana/ui';
import { css } from '@emotion/css';
import { INNER_LABEL_WIDTH, LABEL_WIDTH } from '../constants';

export interface Props {
  children: React.ReactNode;
  tooltip?: PopoverContent;
  label?: React.ReactNode;
  className?: string;
  noFillEnd?: boolean;
  labelWidth?: number;
  fillComponent?: React.ReactNode;
}

export const Row: FC<Props> = ({
  children,
  label,
  tooltip,
  className,
  noFillEnd,
  fillComponent,
  labelWidth = LABEL_WIDTH,
  ...htmlProps
}) => {
  return (
    <div className="gf-form">
      {label && (
        <InlineLabel width={labelWidth} tooltip={tooltip}>
          {label}
        </InlineLabel>
      )}
      <div
        className={css`
          margin-right: 4px;
        `}
      >
        <HorizontalGroup spacing="xs" width="auto">
          {children}
        </HorizontalGroup>
      </div>
      <div className={'gf-form--grow'}>
        {noFillEnd || <div className={'gf-form-label gf-form-label--grow'}>{fillComponent}</div>}
      </div>
    </div>
  );
};

export const Field: FC<Props> = ({ children, label, tooltip, labelWidth = INNER_LABEL_WIDTH }) => {
  return (
    <>
      {label && (
        <InlineLabel width={labelWidth} tooltip={tooltip}>
          {label}
        </InlineLabel>
      )}
      {children}
    </>
  );
};

Row.displayName = 'InlineFields';
