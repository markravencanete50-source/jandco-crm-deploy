'use client';

import React, { useState } from 'react';

interface OffboardModalProps {
  employeeName: string;
  onConfirm: (terminationDate: string) => Promise<void>;
  onClose: () => void;
}

export function OffboardModal({ employeeName, onConfirm, onClose }: OffboardModalProps) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);

  async function handleConfirm() {
    setSubmitting(true);
    try {
      await onConfirm(date);
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="emp-modal-overlay" onClick={onClose}>
      <div className="emp-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="emp-modal__title">Offboard {employeeName}?</h3>
        <p className="emp-modal__text">
          This marks the employee as terminated and records their last day.
          Their record is kept for historical reporting — it is not deleted.
        </p>
        <div className="emp-form__field">
          <label htmlFor="terminationDate">Last day</label>
          <input
            id="terminationDate"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="emp-modal__actions">
          <button className="emp-form__cancel-btn" onClick={onClose}>Cancel</button>
          <button className="emp-profile__offboard-btn" onClick={handleConfirm} disabled={submitting}>
            {submitting ? 'Processing...' : 'Confirm offboard'}
          </button>
        </div>
      </div>
    </div>
  );
}
