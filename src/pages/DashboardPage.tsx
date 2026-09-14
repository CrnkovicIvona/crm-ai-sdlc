import { useEffect, useMemo, useState } from 'react';
import { loadDashboardSnapshot } from '../lib/dashboard';
import {
  ACTIVE_CLIENTS_TOOLTIP,
  CHURNED_CLIENTS_HINT,
  formatNetGrowth,
  formatPercent,
  resolvePeriod,
  type DashboardSnapshot,
  type DatePreset,
  type MonthlyPoint,
} from '../lib/dashboardMetrics';

const PRESETS: Array<{ id: DatePreset; label: string; testId: string }> = [
  { id: 'last7', label: 'Last 7 days', testId: 'dashboard-filter-7' },
  { id: 'last30', label: 'Last 30 days', testId: 'dashboard-filter-30' },
  { id: 'last90', label: 'Last 90 days', testId: 'dashboard-filter-90' },
  { id: 'thisYear', label: 'This year', testId: 'dashboard-filter-year' },
  { id: 'custom', label: 'Custom range', testId: 'dashboard-filter-custom' },
];

function utcDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function Chart({
  testId,
  title,
  points,
  series,
}: {
  testId: string;
  title: string;
  points: MonthlyPoint[];
  series: Array<{
    key: 'activeStock' | 'newClients' | 'churnedClients';
    label: string;
    className: string;
  }>;
}) {
  const values = points.flatMap((point) =>
    series.map((item) => point[item.key]),
  );
  const max = Math.max(1, ...values);
  const width = Math.max(320, points.length * 56);
  const height = 160;
  const pad = 24;
  const innerH = height - pad;
  const groupW = points.length === 0 ? 0 : (width - pad) / points.length;

  return (
    <figure className="dashboard-chart" data-testid={testId}>
      <figcaption>{title}</figcaption>
      {points.length === 0 ? (
        <p data-testid={`${testId}-empty`}>No months in the selected range.</p>
      ) : (
        <svg
          role="img"
          aria-label={title}
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height={height}
        >
          {points.map((point, index) =>
            series.map((item, seriesIndex) => {
              const raw = point[item.key];
              const barH = (raw / max) * (innerH - 16);
              const barW = Math.max(6, groupW / (series.length + 1));
              const x =
                pad / 2 +
                index * groupW +
                seriesIndex * barW +
                (groupW - barW * series.length) / 2;
              const y = innerH - barH;
              return (
                <rect
                  key={`${point.label}-${item.key}`}
                  className={item.className}
                  x={x}
                  y={y}
                  width={barW}
                  height={barH}
                >
                  <title>
                    {point.label} {item.label}: {raw}
                  </title>
                </rect>
              );
            }),
          )}
          {points.map((point, index) => (
            <text
              key={`label-${point.label}`}
              x={pad / 2 + index * groupW + groupW / 2}
              y={height - 4}
              textAnchor="middle"
              className="dashboard-chart-label"
            >
              {point.label}
            </text>
          ))}
        </svg>
      )}
    </figure>
  );
}

export function DashboardPage() {
  const [preset, setPreset] = useState<DatePreset>('last30');
  const [customStart, setCustomStart] = useState(() => {
    const end = new Date();
    const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
    return utcDay(start);
  });
  const [customEnd, setCustomEnd] = useState(() => utcDay(new Date()));
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const period = useMemo(
    () => resolvePeriod(preset, new Date(), customStart, customEnd),
    [preset, customStart, customEnd],
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    void loadDashboardSnapshot(period).then((result) => {
      if (cancelled) {
        return;
      }
      setLoading(false);
      if (!result.ok) {
        setSnapshot(null);
        setError(result.error);
        return;
      }
      setSnapshot(result.snapshot);
    });
    return () => {
      cancelled = true;
    };
  }, [period]);

  return (
    <section data-testid="dashboard-page">
      <div className="crm-page-head">
        <h2>Dashboard</h2>
      </div>
      <div className="dashboard-filters" role="group" aria-label="Date range">
        {PRESETS.map((item) => (
          <button
            key={item.id}
            type="button"
            data-testid={item.testId}
            aria-pressed={preset === item.id}
            className={
              preset === item.id ? 'dashboard-filter-active' : undefined
            }
            onClick={() => setPreset(item.id)}
          >
            {item.label}
          </button>
        ))}
        {preset === 'custom' ? (
          <div className="dashboard-custom">
            <label>
              Start
              <input
                data-testid="dashboard-custom-start"
                type="date"
                value={customStart}
                onChange={(event) => setCustomStart(event.target.value)}
              />
            </label>
            <label>
              End
              <input
                data-testid="dashboard-custom-end"
                type="date"
                value={customEnd}
                onChange={(event) => setCustomEnd(event.target.value)}
              />
            </label>
          </div>
        ) : null}
      </div>
      {error ? (
        <p data-testid="dashboard-error" role="alert">
          {error}
        </p>
      ) : null}
      {loading ? <p data-testid="dashboard-loading">Loading</p> : null}
      {!loading && !error && snapshot ? (
        <>
          <div className="dashboard-kpis">
            <article className="dashboard-kpi" data-testid="kpi-active">
              <h3 title={ACTIVE_CLIENTS_TOOLTIP}>Active Clients</h3>
              <p data-testid="kpi-active-value">{snapshot.activeClients}</p>
              <p className="dashboard-hint">{ACTIVE_CLIENTS_TOOLTIP}</p>
            </article>
            <article className="dashboard-kpi" data-testid="kpi-new">
              <h3>New Clients</h3>
              <p data-testid="kpi-new-value">{snapshot.newClients}</p>
            </article>
            <article className="dashboard-kpi" data-testid="kpi-churned">
              <h3>Churned Clients</h3>
              <p data-testid="kpi-churned-value">{snapshot.churnedClients}</p>
              <p className="dashboard-hint">{CHURNED_CLIENTS_HINT}</p>
            </article>
            <article className="dashboard-kpi" data-testid="kpi-churn-rate">
              <h3>Churn Rate</h3>
              <p data-testid="kpi-churn-rate-value">
                {formatPercent(snapshot.churnRate)}
              </p>
            </article>
            <article className="dashboard-kpi" data-testid="kpi-net-growth">
              <h3>Net Client Growth</h3>
              <p data-testid="kpi-net-growth-value">
                {formatNetGrowth(snapshot.netGrowth)}
              </p>
            </article>
            <article className="dashboard-kpi" data-testid="kpi-adoption">
              <h3>Product Adoption Rate</h3>
              <p data-testid="kpi-adoption-value">
                {formatPercent(snapshot.productAdoption)}
              </p>
            </article>
          </div>
          <Chart
            testId="chart-trend"
            title="Client Base Trend"
            points={snapshot.monthly}
            series={[
              {
                key: 'activeStock',
                label: 'Active',
                className: 'dashboard-bar-active',
              },
            ]}
          />
          <Chart
            testId="chart-new-vs-churned"
            title="New vs. Churned Clients"
            points={snapshot.monthly}
            series={[
              {
                key: 'newClients',
                label: 'New',
                className: 'dashboard-bar-new',
              },
              {
                key: 'churnedClients',
                label: 'Churned',
                className: 'dashboard-bar-churned',
              },
            ]}
          />
          <div className="crm-table-surface">
            <table data-testid="dashboard-product-table">
              <caption>Clients by Product</caption>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Clients</th>
                  <th>% of Active Clients</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.byProduct.length === 0 ? (
                  <tr>
                    <td colSpan={3}>
                      <p data-testid="dashboard-empty-products">
                        No products in the catalog.
                      </p>
                    </td>
                  </tr>
                ) : (
                  snapshot.byProduct.map((row) => (
                    <tr key={row.productId} data-testid="dashboard-product-row">
                      <td>{row.name}</td>
                      <td>{row.clients}</td>
                      <td>{formatPercent(row.percentOfActive)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </section>
  );
}
