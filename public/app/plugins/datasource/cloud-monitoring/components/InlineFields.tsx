import React, { FC } from 'react';
import { InlineLabel, PopoverContent } from '@grafana/ui';
import { css, cx } from '@emotion/css';

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
  labelWidth,
  noFillEnd,
  fillComponent,
  ...htmlProps
}) => {
  return (
    <div className="gf-form">
      {label && (
        <InlineLabel
          width={18}
          tooltip={tooltip}
          className={cx(
            'query-keyword',
            css`
              color: unset;
            `
          )}
        >
          {label}
        </InlineLabel>
      )}
      {children}

      <div className={'gf-form--grow'}>
        {noFillEnd || <div className={'gf-form-label gf-form-label--grow'}>{fillComponent}</div>}
      </div>
    </div>
  );
};

export const Field: FC<Props> = ({ children, label, tooltip, className, labelWidth, noFillEnd, ...htmlProps }) => {
  return (
    <>
      {label && (
        <InlineLabel
          width={18}
          tooltip={tooltip}
          className={cx(
            'query-keyword',
            css`
              color: unset;
            `
          )}
        >
          {label}
        </InlineLabel>
      )}
      {children}
    </>
  );
};

Row.displayName = 'InlineFields';
