import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { DeleteClientDialog } from '../components/DeleteClientDialog';
import {
  GENERIC_CLIENT_ERROR,
  validateClientInput,
  type ClientInput,
  type FieldErrors,
} from '../lib/clientValidation';
import {
  createClient,
  deleteClient,
  getClient,
  listProducts,
  setClientProducts,
  updateClient,
} from '../lib/clients';
import { OPTIONAL_PRODUCTS_COPY, type ProductRecord } from '../lib/products';

const EMPTY: ClientInput = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  oib: '',
};

export function ClientFormPage() {
  const { id } = useParams();
  const isCreate = !id;
  const navigate = useNavigate();
  const location = useLocation();
  const noticeFromState =
    typeof location.state === 'object' &&
    location.state !== null &&
    'notice' in location.state &&
    typeof location.state.notice === 'string'
      ? location.state.notice
      : null;

  const [values, setValues] = useState<ClientInput>(EMPTY);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [fields, setFields] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(noticeFromState);
  const [pending, setPending] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [catalog, setCatalog] = useState<ProductRecord[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    void listProducts().then((result) => {
      if (cancelled || !result.ok) {
        return;
      }
      setCatalog(result.products);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (noticeFromState) {
      setSuccess(noticeFromState);
    }
  }, [noticeFromState]);

  useEffect(() => {
    if (!id) {
      setValues(EMPTY);
      setCreatedAt(null);
      setSelectedProductIds([]);
      return;
    }
    let cancelled = false;
    void getClient(id).then((result) => {
      if (cancelled) {
        return;
      }
      if (!result.ok) {
        setError(GENERIC_CLIENT_ERROR);
        return;
      }
      setValues({
        first_name: result.record.first_name,
        last_name: result.record.last_name,
        email: result.record.email,
        phone: result.record.phone,
        oib: result.record.oib,
      });
      setCreatedAt(result.record.created_at);
      setSelectedProductIds(
        result.record.products.map((product) => product.id),
      );
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    const parsed = validateClientInput(values);
    if (!parsed.ok) {
      setFields(parsed.fields);
      return;
    }
    setFields({});
    setPending(true);
    const result = isCreate
      ? await createClient(parsed.value)
      : await updateClient(id!, parsed.value);
    if (!result.ok) {
      setPending(false);
      setSuccess(null);
      setError(result.error);
      if (result.fields) {
        setFields(result.fields);
      }
      return;
    }
    const assigned = await setClientProducts(
      result.record.id,
      selectedProductIds,
    );
    setPending(false);
    if (!assigned.ok) {
      setSuccess(null);
      setError(GENERIC_CLIENT_ERROR);
      return;
    }
    if (isCreate) {
      setSuccess('Client created.');
      navigate(`/app/clients/${result.record.id}`, {
        replace: true,
        state: { notice: 'Client created.' },
      });
      return;
    }
    setValues({
      first_name: result.record.first_name,
      last_name: result.record.last_name,
      email: result.record.email,
      phone: result.record.phone,
      oib: result.record.oib,
    });
    setCreatedAt(result.record.created_at);
    setSuccess('Client saved.');
  }

  async function onConfirmDelete() {
    if (!id) {
      return;
    }
    setPending(true);
    setError(null);
    setSuccess(null);
    const result = await deleteClient(id);
    setPending(false);
    if (!result.ok) {
      setConfirmDelete(false);
      setError(GENERIC_CLIENT_ERROR);
      return;
    }
    navigate('/app/clients', { state: { notice: 'Client deleted.' } });
  }

  return (
    <section data-testid="client-form-page">
      <p>
        <Link to="/app/clients">Back to clients</Link>
      </p>
      <h2>{isCreate ? 'New client' : 'Edit client'}</h2>
      {error ? (
        <p data-testid="client-error" role="alert">
          {error}
        </p>
      ) : null}
      {success ? <p data-testid="client-success">{success}</p> : null}
      <form data-testid="client-form" onSubmit={onSubmit}>
        <label>
          First name
          <input
            data-testid="client-first-name"
            name="first_name"
            value={values.first_name}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                first_name: event.target.value,
              }))
            }
          />
        </label>
        {fields.first_name ? (
          <p data-testid="field-error-first_name">{fields.first_name}</p>
        ) : null}
        <label>
          Last name
          <input
            data-testid="client-last-name"
            name="last_name"
            value={values.last_name}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                last_name: event.target.value,
              }))
            }
          />
        </label>
        {fields.last_name ? (
          <p data-testid="field-error-last_name">{fields.last_name}</p>
        ) : null}
        <label>
          Email
          <input
            data-testid="client-email"
            name="email"
            value={values.email}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
          />
        </label>
        {fields.email ? (
          <p data-testid="field-error-email">{fields.email}</p>
        ) : null}
        <label>
          Phone
          <input
            data-testid="client-phone"
            name="phone"
            value={values.phone}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                phone: event.target.value,
              }))
            }
          />
        </label>
        {fields.phone ? (
          <p data-testid="field-error-phone">{fields.phone}</p>
        ) : null}
        <label>
          OIB
          <input
            data-testid="client-oib"
            name="oib"
            value={values.oib}
            onChange={(event) =>
              setValues((current) => ({ ...current, oib: event.target.value }))
            }
          />
        </label>
        {fields.oib ? <p data-testid="field-error-oib">{fields.oib}</p> : null}
        {createdAt ? (
          <p>
            Created
            <span data-testid="client-created-at"> {createdAt}</span>
          </p>
        ) : null}
        <fieldset data-testid="client-products">
          <legend>Products</legend>
          <p>{OPTIONAL_PRODUCTS_COPY}</p>
          {catalog.map((product) => (
            <label key={product.id}>
              <input
                data-testid={`product-${product.code}`}
                type="checkbox"
                checked={selectedProductIds.includes(product.id)}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setSelectedProductIds((current) =>
                    checked
                      ? [...current, product.id]
                      : current.filter((id) => id !== product.id),
                  );
                }}
              />
              {product.name}
            </label>
          ))}
        </fieldset>
        <button data-testid="client-save" type="submit" disabled={pending}>
          {isCreate ? 'Create' : 'Save'}
        </button>
      </form>
      {!isCreate ? (
        <p>
          <button
            data-testid="client-delete"
            type="button"
            onClick={() => setConfirmDelete(true)}
            disabled={pending}
          >
            Delete
          </button>
        </p>
      ) : null}
      <DeleteClientDialog
        open={confirmDelete}
        pending={pending}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          void onConfirmDelete();
        }}
      />
    </section>
  );
}
