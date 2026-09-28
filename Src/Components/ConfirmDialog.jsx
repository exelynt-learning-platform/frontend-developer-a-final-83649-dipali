export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="modal d-block" style={{ background: 'rgba(0,0,0,.5)' }} role="dialog" aria-modal="true">
      <div className="modal-dialog modal-dialog-centered"><div className="modal-content">
        <div className="modal-body">{message}</div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div></div></div>
    </div>);
}
