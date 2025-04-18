'use client';

import { useState } from 'react';
import styles from '../css/page.module.css';

export default function IIndexCreateInvoice() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('../api/createInvoice', { method: 'POST' });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('エラーが発生しました。しばらく経ってから再度お試しください。');
      }
    } catch (error) {
      console.error('Error: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <button className={styles.donationButton} onClick={handlePayment} disabled={loading}>
          {loading ? '支払い処理中' : '支払う'}
        </button>
      </div>
    </>
  );
}
