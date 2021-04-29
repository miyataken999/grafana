import { css } from '@emotion/react';
import { GrafanaThemeV2 } from '@grafana/data';

export function getPageStyles(theme: GrafanaThemeV2) {
  return css`
    .grafana-app {
      display: flex;
      align-items: stretch;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }

    .main-view {
      position: relative;
      flex-grow: 1;
    }

    .page-scrollbar-wrapper {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
    }

    .page-scrollbar-content {
      display: flex;
      min-height: 100%;
      flex-direction: column;
      width: 100%;
      height: 100%;
    }

    .page-container {
      flex-grow: 1;
      flex-basis: 100%;
      padding-left: ${theme.spacing(2)};
      padding-right: ${theme.spacing(2)};

      ${theme.breakpoints.up('sm')} {
        margin: ${theme.spacing(0, 1)};
      }

      ${theme.breakpoints.up('md')} {
        margin: ${theme.spacing(0, 2)};
      }

      ${theme.breakpoints.up('xxl')} {
        max-width: ${theme.breakpoints.values.xl}px;
        margin-left: auto;
        margin-right: auto;
        width: 100%;
      }
    }

    .page-full {
      margin-left: ${theme.spacing(2)};
      padding-left: ${theme.spacing(2)};
      padding-right: ${theme.spacing(2)};
    }

    .page-body {
      padding: ${theme.spacing(1)};
      background: ${theme.components.panel.background};
      border: 1px solid ${theme.components.panel.borderColor};
      margin-bottom: 32px;

      ${theme.breakpoints.up('md')} {
        padding: ${theme.spacing(2)};
      }

      ${theme.breakpoints.up('lg')} {
        padding: ${theme.spacing(4)};
      }
    }

    .page-heading {
      font-size: ${theme.typography.h4.fontSize};
      margin-top: 0;
      margin-bottom: $spacer;
    }

    .page-action-bar {
      margin-bottom: ${theme.spacing(2)};
      display: flex;
      align-items: flex-start;

      > a,
      > button {
        margin-left: ${theme.spacing(2)};
      }
    }

    .page-action-bar--narrow {
      margin-bottom: 0;
    }

    .page-action-bar__spacer {
      width: ${theme.spacing(2)};
      flex-grow: 1;
    }

    .page-sub-heading {
      margin-bottom: ${theme.spacing(1)};
    }

    .page-sub-heading-icon {
      margin-left: ${theme.spacing(1)};
      margin-top: ${theme.spacing(0.5)};
    }
  `;
}
