'use client';

import { useState } from 'react';
import styles from '../css/page.module.css';

export default function IIndexCreateInvoice() {
  const [showModal, setShowModal] = useState(false);

  // 旧API支払いロジック（コメントアウト）
  // const [loading, setLoading] = useState(false);
  // const handlePayment = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch('../api/createInvoice', { method: 'POST' });
  //     const data = await response.json();
  //     if (data.url) {
  //       window.location.href = data.url;
  //     } else {
  //       alert('エラーが発生しました。しばらく経ってから再度お試しください。');
  //     }
  //   } catch (error) {
  //     console.error('Error: ', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handlePayment = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div>
        <button className={styles.kihuButton} onClick={handlePayment}>
          ⚡ 寄付
        </button>
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>ライトニング支払いはこちら</h2>
              <button className={styles.closeButton} onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.qrContainer}>
                <img
                  src="/qr-code.png"
                  alt="QR Code"
                  className={styles.qrCode}
                />
              </div>
              <div className={styles.paymentInfo}>
                <p>支払い先:</p>
                <div className={styles.lightningAddress}>rudeweapon88@walletofsatoshi.com</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
