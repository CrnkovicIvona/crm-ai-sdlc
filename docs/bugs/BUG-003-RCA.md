# RCA: BUG-003

- Production escape: no

## Impact

ADMIN can save a client successfully but may not notice
`Client saved.` because it looks like ordinary body text. Data is
written; confirmation is weak. No data loss.

## Timeline

1. CRM-001 UI/UX pass (2026-08-23) styled errors with colour, border,
   and icon; success copy was kept as BD-T012 strings without a
   matching banner.
2. CRM-001 **`RELEASED`**. Playwright asserts the exact string, not
   contrast.
3. 2026-09-14: PO asked for green, more prominent validation after
   Save.

## Immediate fix

Style `client-success` as a green success banner. Do not change
BD-T012 wording or testids.

## Root cause

Success and error were not given the same visual system. Tests lock
the string, not the presentation.

## Why it escaped

- AC/TC check `toHaveText('Client saved.')`, not colour/contrast.
- UI proposal treated success as “kept” copy, not a banner.

## Corrective actions

- CSS success treatment parallel to errors (icon in CSS background).

## Preventive actions

- When adding notices, pair error and success chrome.
- Do not treat e2e string match as proof of visibility.

## Residual risk

Colour-only would fail some users; the banner also uses border,
weight, and icon. Contrast of green-on-tint should be checked in
human QA.
