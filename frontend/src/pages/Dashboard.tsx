import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";
import styles from "../styles/dashboard.module.css";
import profilePic from "../assets/profile.png";

const Dashboard: React.FC = () => {
  const myMail = localStorage.getItem("user_email")!;
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();
  const cardRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
  const [userID, setUserID] = useState<BigInteger>();
  const [userName, setUserName] = useState<string>("");
  const [userImage, setUserImage] = useState<string>( profilePic);

  useEffect(() => {
    async function getUserData() {
      try {
        const res = await fetch(`http://localhost:3001/api/users/email/${myMail}`);
        if (!res.ok) throw new Error("Error cargando el perfil");

        const data = await res.json();
        setUserName(data.username || "");
        setUserID(data.id || BigInt(0));
        setUserImage(data.profile_image || profilePic);
      } catch (err: any) {
        console.error(err.message);
      }
    }
    getUserData();
  }, [myMail]);
  

  const cardsData = [
    { id: 1, text: 'Main Balance', category: 'all' },
    { id: 2, text: 'Sunshine Memory', category: 'sent' },
    { id: 3, text: 'Gift Card', category: 'received' },
    { id: 4, text: 'Travel Card', category: 'sent' },
    { id: 5, text: 'Bonus Card', category: 'received' }
  ];

  const filteredCards = cardsData.filter(card => {
    const matchesCategory = filter === 'all' ? true : card.category === filter;
    const matchesSearch = card.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  const getComputedBgColor = (id: number) => {
    const cardElement = cardRefs.current[id];
    if (!cardElement) return 'rgba(0,0,0,0.3)';
    return window.getComputedStyle(cardElement).backgroundColor;
  };

  return (
    <div className={styles.dashboardWrapper}>
      <Navbar />

      <div className={styles.content}>
        <img src={userImage} alt="Profile" className={styles.profileImage} />
        <div className={styles.textContainer}>
          <h1 className={styles.greeting}>
            Hello <br />
            <span className={styles.userName}>{userName ? userName : "User"}</span>
          </h1>
          <button onClick={() => navigate("/cardAdd")} className={`${styles.addButton} ${styles.desktopOnly}`}>
            Add Card
          </button>
        </div>
      </div>

      <div className={styles.myCardsSection}>
        <div className={styles.searchcontainer}>
          <input
            className={styles.searchbar}
            type="text"
            placeholder="Search here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button onClick={() => navigate("/cardAdd")} className={`${styles.addButton} ${styles.mobileOnly}`}>
          Add Card
        </button>

        <div className={styles.buttonContainer}>
          <button className={`${styles.allbutton} ${filter === 'all' ? styles.active : ''}`} onClick={() => setFilter('all')}>
            All
          </button>
          <button className={`${styles.sentbutton} ${filter === 'sent' ? styles.active : ''}`} onClick={() => setFilter('sent')}>
            Sent
          </button>
          <button className={`${styles.receivedbutton} ${filter === 'received' ? styles.active : ''}`} onClick={() => setFilter('received')}>
            Received
          </button>
        </div>

        <div className={styles.cardscontainer}>
          <div className={styles.cards}>
            {filteredCards.map(card => (
              <button
                key={card.id}
                ref={(el) => {
                  if (el) {
                    cardRefs.current[card.id] = el;
                  }
                }}
                className={`${styles.card} ${getCardClass(card.id)}`}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0px 0px 15px ${getComputedBgColor(card.id)}`)}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `none`)}
                onClick={() => navigate(`/CardEdit/${card.id}`)}
              >
                <p className={styles.cardtext}>{card.text}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`${styles.mobileNavbarWrapper} mobileNavbarOnly`}>
        <MobileNavbar />
      </div>
    </div>
  );
};

export default Dashboard;
