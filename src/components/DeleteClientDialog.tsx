type DeleteClientDialogProps = {
  open: boolean;
  pending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function DeleteClientDialog({
  open,
  pending,
  onConfirm,
  onCancel,
}: DeleteClientDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div data-testid="delete-dialog" role="dialog" aria-modal="true">
      <p>Delete this client?</p>
      <button
        data-testid="delete-cancel"
        type="button"
        onClick={onCancel}
        disabled={pending}
      >
        Cancel
      </button>
      <button
        data-testid="delete-confirm"
        type="button"
        onClick={onConfirm}
        disabled={pending}
      >
        Delete
      </button>
    </div>
  );
}
