import React from "react";
import styles from "../styles/home.module.css";

function CardContent(props: { title: string; description: string }) {
  return (
    <div>
      <h2>{props.title}</h2>
      <p>{props.description}</p>
    </div>
  );
}

class Card extends React.Component<{ title: string; description: string; URL?: string }> {
  render() {
    return this.props.URL ? (
      <a href={this.props.URL} className={styles.card}>
        <CardContent title={this.props.title} description={this.props.description} />
      </a>
    ) : (
      <div className={styles.card}>
        <CardContent title={this.props.title} description={this.props.description} />
      </div>
    );
  }
}

export default Card;
