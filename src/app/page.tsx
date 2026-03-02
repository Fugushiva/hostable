import Image from "next/image";
import styles from "./page.module.css";
import { db } from "@/db";

export default async function Home() {
  // Fetch real announcements from db
  // Make sure we have relations established in our db instance
  const announcementsList = await db.query.annonces.findMany({
    with: {
      host: {
        with: {
          user: true
        }
      },
      annoncesPictures: true,
      country: true
    },
    limit: 6, // limiting to show in "Featured"
  });

  return (
    <div className="min-h-screen bg-[#F9F9F7]">
      <header className={styles.navbar}>
        <div className={styles.logoContainer}>
          {/* Logo symbol as inline SVG */}
          <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 50C30 38.9543 38.9543 30 50 30C61.0457 30 70 38.9543 70 50C70 61.0457 61.0457 70 50 70C38.9543 70 30 61.0457 30 50Z" stroke="#D4412C" strokeWidth="8" />
            <path d="M70 50C70 38.9543 78.9543 30 90 30C101.046 30 110 38.9543 110 50C110 61.0457 101.046 70 90 70C78.9543 70 70 61.0457 70 50Z" stroke="#D4412C" strokeWidth="8" transform="translate(-40, 0)" />
            <path d="M50 50 L50 50" stroke="#D4412C" strokeWidth="8" strokeLinecap="round" />
          </svg>
          <span className={styles.logoText}>HosTable</span>
        </div>
        <nav className={styles.navLinks}>
          <span className={styles.navLink}>Discover</span>
          <span className={styles.navLink}>Host an experience</span>
          <span className={styles.navLink}>Become a host</span>
          <span className={styles.navLink}>Help</span>
        </nav>
        <div className={styles.navActions}>
          <button className={styles.iconBtn} aria-label="Web">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </button>
          <img src="https://i.pravatar.cc/150?img=47" alt="Profile" className={styles.profilePic} />
        </div>
      </header>

      <main>
        <section className={styles.heroSection}>
          <div className={styles.heroImageContainer}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop"
              alt="Cooking experience"
              className={styles.heroImage}
            />
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>Welcome back, Celia</h1>
              <p className={styles.heroSubtitle}>Find and book unique food experiences around the world</p>

              <div className={styles.searchBar}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4412C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '1rem' }}>
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder="Let's start with a city or cuisine"
                  className={styles.searchInput}
                />
                <button className={styles.searchBtn}>Search</button>
                <button className={styles.moreBtn}>More</button>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.categoryTabs}>
          <span className={`${styles.tab} ${styles.active}`}>For you</span>
          <span className={styles.tab}>Online</span>
          <span className={styles.tab}>In person</span>
          <span className={styles.tab}>Gift cards</span>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Experiences for you</h2>
          {announcementsList.length > 0 ? (
            <div className={styles.grid}>
              {announcementsList.map((item) => {
                const imagePath = item.annoncesPictures?.[0]?.path
                  ? (item.annoncesPictures[0].path.startsWith('http') ? item.annoncesPictures[0].path : `/img/annonces/${item.id}/photo1.jpg`)
                  : `/img/annonces/${item.id}/photo1.jpg`;

                return (
                  <div key={item.id} className={styles.card}>
                    <div className={styles.cardImageWrapper}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePath}
                        alt={item.title}
                        className={styles.cardImage}
                      />
                    </div>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <div className={styles.cardSubtitle}>
                      {item.cuisine && `${item.cuisine} - `}
                      {item.host?.user?.firstname ? `Hosted by ${item.host.user.firstname}` : item.country?.name || 'Local'}
                    </div>
                    <div className={styles.cardPrice}>
                      €{Number(item.price)} <span className={styles.priceUnit}>per guest</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>Oups ! Aucune annonce n'a été trouvée dans la base de données. Essayez d'en ajouter via l'interface d'administration.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
