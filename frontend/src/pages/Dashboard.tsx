  import React, { useEffect, useState, useRef } from "react";
  import { useNavigate } from "react-router-dom";
  import Navbar from "../components/Navbar";
  import MobileNavbar from "../components/MobileNavbar";
  import styles from "../styles/dashboard.module.css";
  import profilePic from "../assets/profile.png";

  type Postcard = {
    id: number;
    title: string;
    sender_id: number;
    receiver_id: number;
    image: string;
    created_at: string;
    description:string;
    model:string;
    // agrega más campos si los necesitas
  };

  const Dashboard: React.FC = () => {
    const myMail = localStorage.getItem("user_email")!;
    const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const navigate = useNavigate();
    const cardRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

    const [userID, setUserID] = useState<number | null>(null);
    const [userName, setUserName] = useState<string>("");
    const [userImage, setUserImage] = useState<string>(profilePic);

    const [sentCards, setSentCards] = useState<Postcard[]>([]);
    const [receivedCards, setReceivedCards] = useState<Postcard[]>([]);

    useEffect(() => {
      async function getUserData() {
        try {
          const res = await fetch(`http://localhost:3001/api/users/email/${myMail}`);
          if (!res.ok) throw new Error("Error cargando el perfil");
          const data = await res.json();

          setUserName(data.username || "");
          setUserID(data.id);
          setUserImage(data.profile_image || profilePic);
        } catch (err: any) {
          console.error(err.message);
        }
      }

      getUserData();
    }, [myMail]);

    useEffect(() => {
      if (userID == null) return;

      async function fetchCards() {
        try {
          const [sentRes, recRes] = await Promise.all([
            fetch(`http://localhost:3001/api/postcards/sent/${userID}`),
            fetch(`http://localhost:3001/api/postcards/received/${userID}`)
          ]);

          if (!sentRes.ok || !recRes.ok) throw new Error("Error obteniendo postales");

          const sentData = await sentRes.json();
          const receivedData = await recRes.json();

          setSentCards(sentData);
          setReceivedCards(receivedData);
        } catch (err: any) {
          console.error("Error cargando postales:", err.message);
        }
      }

      fetchCards();
    }, [userID]);

    const getFilteredCards = (): Postcard[] => {
      let cards: Postcard[] = [];

      if (filter === 'sent') cards = sentCards;
      else if (filter === 'received') cards = receivedCards;
      else cards = [...sentCards, ...receivedCards];

      cards = cards.filter(card => card.title.toLowerCase().includes(searchQuery.toLowerCase()));

      cards.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return cards;
    };


    const getCardClass = (index: number) => {
      const classes = [styles.mainBalanceCard, styles.sunshineCard, styles.giftCard, styles.travelCard, styles.bonusCard];
      return classes[index % classes.length];
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
              <span className={styles.userName}>{userName || "User"}</span>
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
            <button className={`${styles.allbutton} ${filter === 'all' ? styles.active : ''}`} onClick={() => setFilter('all')}>All</button>
            <button className={`${styles.sentbutton} ${filter === 'sent' ? styles.active : ''}`} onClick={() => setFilter('sent')}>Sent</button>
            <button className={`${styles.receivedbutton} ${filter === 'received' ? styles.active : ''}`} onClick={() => setFilter('received')}>Received</button>
          </div>

          <div className={styles.cardscontainer}>
            <div className={styles.cards}>
              {getFilteredCards().map((card, index) => (
                <button
                  key={card.id}
                  ref={(el) => { if (el) cardRefs.current[card.id] = el; }}
                  className={styles.card}
                  style={{
                    backgroundImage: `url("${card.image}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0px 0px 15px ${getComputedBgColor(card.id)}`)}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `none`)}
                  onClick={() => {
                    if (card.sender_id === userID) {
                      navigate(`/CardEdit/${card.id}`);
                    } else {
                      navigate(`/CardPreview/${card.id}`);
                    }
                  }}
                >
                  <p className={styles.cardtext}>{card.title}</p>
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
