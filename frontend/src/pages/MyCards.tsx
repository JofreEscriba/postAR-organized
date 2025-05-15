import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import styles from '../styles/MyCards.module.css';
import { useNavigate } from 'react-router-dom';

const MyCards: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const cardRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});


  const cardsData = [
    { id: 1, text: 'Main Balance', category: 'all' },
    { id: 2, text: 'Sunshine Memory', category: 'sent' },
    { id: 3, text: 'Gift Card', category: 'received' },
    { id: 4, text: 'Travel Card', category: 'sent' },
    { id: 5, text: 'Bonus Card', category: 'received' }
  ];

  // Function to assign class
  const getCardClass = (id: number) => {
    switch (id) {
      case 1: return styles.mainBalanceCard;
      case 2: return styles.sunshineCard;
      case 3: return styles.giftCard;
      case 4: return styles.travelCard;
      case 5: return styles.bonusCard;
      default: return '';
    }
  };

  // Function to get the computed background color of a card
  const getComputedBgColor = (id: number) => {
    const cardElement = cardRefs.current[id];
    if (!cardElement) return 'rgba(0,0,0,0.3)'; // Default shadow if no element
    return window.getComputedStyle(cardElement).backgroundColor;
  };

  return (
    <div className={styles.wrapper}>
      <Navbar />
      <h1 className={styles.title}>My Cards</h1>

      {/* Search Bar */}
      <div className={styles.searchcontainer}>
        <input
          className={styles.searchbar}
          type="text"
          placeholder="Search here..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Buttons */}
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.allbutton} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`${styles.sentbutton} ${filter === 'sent' ? styles.active : ''}`}
          onClick={() => setFilter('sent')}
        >
          Sent
        </button>
        <button
          className={`${styles.receivedbutton} ${filter === 'received' ? styles.active : ''}`}
          onClick={() => setFilter('received')}
        >
          Received
        </button>
      </div>

      {/* Cards Section */}
      <div className={styles.cardscontainer}>
        <div className={styles.cards}>
          {cardsData
            .filter(card => (filter === 'all' ? true : card.category === filter) &&
              card.text.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(card => (
              <button
                key={card.id}
                ref={(el) => {
                  if (el) {
                    cardRefs.current[card.id] = el;
                  }
                }}
                className={`${styles.card} ${getCardClass(card.id)}`}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0px 0px 20px ${getComputedBgColor(card.id)}`)}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `none`)}
                onClick={() => navigate(`/CardEdit/${card.id}`)}
              >
                <p className={styles.cardtext}>{card.text}</p>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MyCards;
