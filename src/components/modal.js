import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';

const Modal = ({ onClose, score, time, onMenu }) => {
  const { t } = useTranslation();
  const confettiIntervalRef = useRef(null);

  const launchConfetti = () => {
    const duration = 15 * 500;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 5, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }
    confettiIntervalRef.current = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(confettiIntervalRef.current);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);
  };

  useEffect(() => {
    if (score >= 3) {
      launchConfetti();
    }
    return () => clearInterval(confettiIntervalRef.current);
  }, [score]);

  const handleClose = () => {
    clearInterval(confettiIntervalRef.current);
    onClose();
  };

  const handleMenu = () => {
    clearInterval(confettiIntervalRef.current);
    onMenu();
  };

  const getTitle = () => {
    if (score === 5) {
      return t('modal.congratulations');
    } else if (score >= 3) {
      return t('modal.goodJob');
    } else {
      return t('modal.tryAgain');
    }
  };

  return (
    <div className="modal_container">
      <div className="modal_content">
        <h1>{getTitle()}</h1>
        <div className="modal_header">
          <div className='score_modal'>
            <h2 className='modal_title'>{t('modal.score')}</h2>
            <span className="modal_score">{score}/5</span>
          </div>
          <div>
            <h2 className='modal_title'>{t('modal.time')}</h2>
            <span className="modal_time">{time} s</span>
          </div>
        </div>
        <div className='modal_buttons'>
          <button onClick={handleClose} className='modal_button'>
            {t('modal.retry')}
          </button>
          <button onClick={handleMenu} className='modal_button'>
            {t('modal.menu')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
