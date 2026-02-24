import styles from "./TestimonialCard.module.scss";

type TestimonialCardProps = {
  text: string;
  image: string;
  name: string;
  jobTitle: string;
}

export default function TestimonialCard({text, image, name, jobTitle}: TestimonialCardProps) {
  return (
    <div className={styles.testimonialCard}>
      <div className={styles.stars}>★★★★★</div>
      <p className={styles.testimonialText}>{text}</p>
      <div className={styles.userInfo}>
        <img src={image} alt="User Avatar" className={styles.userAvatar}/>
        <div className={styles.userDetails}>
          <h4>{name}</h4>
          <span>{jobTitle}</span>
        </div>
      </div>
    </div>
  );
}
