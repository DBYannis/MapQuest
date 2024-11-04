import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ModalSkip = ({ isOpen, onClose, city }) => {
  const { t } = useTranslation();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsExiting(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen && !isExiting) return null;

  return (
    <div className={`modal_skipped ${isExiting ? 'slide-out' : ''}`}>
      <div className="modal_skipped_container">
        <div className='modal_skipped_elements'>
          <p className='modal_skipped_text'>{t('modal.skipped')}</p>
          <span className='city_skipped'>{city}</span>
        </div>
      </div>
      <button className='modal_skipped_button' onClick={handleClose}>X</button>
    </div>
  );
};

export default ModalSkip;
