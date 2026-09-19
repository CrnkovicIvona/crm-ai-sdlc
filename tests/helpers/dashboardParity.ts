import type { DashboardSnapshot } from '../../src/lib/dashboardMetrics';

/** Fields a user can see or that drive visible KPIs/charts/table. */
export function dashboardPublicTruth(snapshot: DashboardSnapshot) {
  return {
    activeClients: snapshot.activeClients,
    newClients: snapshot.newClients,
    churnedClients: snapshot.churnedClients,
    openingBase: snapshot.openingBase,
    churnRate: snapshot.churnRate,
    netGrowth: snapshot.netGrowth,
    productAdoption: snapshot.productAdoption,
    clientsWithProducts: snapshot.clientsWithProducts,
    byProduct: snapshot.byProduct,
    monthly: snapshot.monthly.map((point) => ({
      label: point.label,
      portionEnd: point.portionEnd.toISOString(),
      activeStock: point.activeStock,
      newClients: point.newClients,
      churnedClients: point.churnedClients,
    })),
  };
}
