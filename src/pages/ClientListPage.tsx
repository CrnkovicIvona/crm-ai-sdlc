import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { GENERIC_CLIENT_ERROR } from '../lib/clientValidation';
import {
  CLIENT_PAGE_SIZE,
  listClients,
  type ClientRecord,
} from '../lib/clients';
import { EMPTY_PRODUCTS_COPY } from '../lib/products';

export function ClientListPage() {
  const { role } = useAuth();
  const location = useLocation();
  const noticeFromState =
    typeof location.state === 'object' &&
    location.state !== null &&
    'notice' in location.state &&
    typeof location.state.notice === 'string'
      ? location.state.notice
      : null;
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const page = Math.max(1, Number(params.get('page') ?? '1') || 1);
  const [draft, setDraft] = useState(query);
  const [rows, setRows] = useState<ClientRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDraft(query);
  }, [query]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      if (draft === query) {
        return;
      }
      const next = new URLSearchParams();
      if (draft.trim()) {
        next.set('q', draft);
      }
      next.set('page', '1');
      setParams(next, { replace: true });
    }, 300);
    return () => window.clearTimeout(handle);
  }, [draft, query, setParams]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    void listClients(query, page).then((result) => {
      if (cancelled) {
        return;
      }
      setLoading(false);
      if (!result.ok) {
        setRows([]);
        setTotal(0);
        setError(GENERIC_CLIENT_ERROR);
        return;
      }
      setRows(result.data.rows);
      setTotal(result.data.total);
    });
    return () => {
      cancelled = true;
    };
  }, [query, page]);

  const totalPages = Math.max(1, Math.ceil(total / CLIENT_PAGE_SIZE));
  const emptyCopy = query.trim() ? 'No matching clients.' : 'No clients yet.';

  function goToPage(nextPage: number) {
    const next = new URLSearchParams();
    if (query.trim()) {
      next.set('q', query);
    }
    next.set('page', String(nextPage));
    setParams(next);
  }

  return (
    <section data-testid="client-list">
      <h2>Clients</h2>
      {noticeFromState ? (
        <p data-testid="client-success">{noticeFromState}</p>
      ) : null}
      {role === 'ADMIN' ? (
        <p>
          <Link data-testid="client-create" to="/app/clients/new">
            New client
          </Link>
        </p>
      ) : null}
      <label>
        Search
        <input
          data-testid="client-search"
          type="search"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
      </label>
      {error ? (
        <p data-testid="client-error" role="alert">
          {error}
        </p>
      ) : null}
      {loading ? <p data-testid="client-loading">Loading</p> : null}
      {!loading && !error && rows.length === 0 ? (
        <p data-testid="client-empty">{emptyCopy}</p>
      ) : null}
      {!loading && rows.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>First name</th>
              <th>Last name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>OIB</th>
              <th>Products</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} data-testid="client-row">
                <td>
                  <Link
                    data-testid={`client-link-${row.id}`}
                    to={`/app/clients/${row.id}`}
                  >
                    {row.first_name}
                  </Link>
                </td>
                <td>{row.last_name}</td>
                <td>{row.email}</td>
                <td>{row.phone}</td>
                <td>{row.oib}</td>
                <td data-testid={`client-products-${row.id}`}>
                  {row.products.length > 0
                    ? row.products.map((product) => product.name).join(', ')
                    : EMPTY_PRODUCTS_COPY}
                </td>
                <td>{row.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
      {total > CLIENT_PAGE_SIZE ? (
        <p>
          <button
            data-testid="client-pager-prev"
            type="button"
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
          >
            Previous
          </button>
          <span data-testid="client-page">
            {page} / {totalPages}
          </span>
          <button
            data-testid="client-pager-next"
            type="button"
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
          >
            Next
          </button>
        </p>
      ) : null}
    </section>
  );
}
