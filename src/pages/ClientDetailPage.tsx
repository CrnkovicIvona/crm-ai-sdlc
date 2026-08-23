import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { GENERIC_CLIENT_ERROR } from '../lib/clientValidation';
import { getClient, type ClientRecord } from '../lib/clients';

export function ClientDetailPage() {
  const { id } = useParams();
  const [record, setRecord] = useState<ClientRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError(GENERIC_CLIENT_ERROR);
      return;
    }
    let cancelled = false;
    void getClient(id).then((result) => {
      if (cancelled) {
        return;
      }
      if (!result.ok) {
        setRecord(null);
        setError(GENERIC_CLIENT_ERROR);
        return;
      }
      setError(null);
      setRecord(result.record);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <section data-testid="client-detail">
      <p>
        <Link to="/app/clients">Back to clients</Link>
      </p>
      {error ? (
        <p data-testid="client-error" role="alert">
          {error}
        </p>
      ) : null}
      {record ? (
        <dl>
          <dt>First name</dt>
          <dd data-testid="client-first-name">{record.first_name}</dd>
          <dt>Last name</dt>
          <dd data-testid="client-last-name">{record.last_name}</dd>
          <dt>Email</dt>
          <dd data-testid="client-email">{record.email}</dd>
          <dt>Phone</dt>
          <dd data-testid="client-phone">{record.phone}</dd>
          <dt>OIB</dt>
          <dd data-testid="client-oib">{record.oib}</dd>
          <dt>Created</dt>
          <dd data-testid="client-created-at">{record.created_at}</dd>
        </dl>
      ) : null}
    </section>
  );
}
