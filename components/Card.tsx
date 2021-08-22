import React, { ReactNode } from "react";
import Link from "next/link";

import styles from "../styles/home.module.scss";

const CardContent = (props: {
  title: string;
  description: string;
  children?: ReactNode;
}) => {
  return (
    <div>
      <h2>{props.title}</h2>
      <p>{props.description}</p>
      {props.children}
    </div>
  );
};

class Card extends React.Component<{
  title: string;
  description: string;
  URL?: string;
  className?: string;
}> {
  render() {
    const classNames =
      "shadow-md " +
      styles.card +
      (this.props.className ? " " + this.props.className : "");

    return this.props.URL ? (
      <Link href={this.props.URL}>
        <a className={classNames}>
          <CardContent title={this.props.title} description={this.props.description} />
        </a>
      </Link>
    ) : (
      <div className={classNames}>
        <CardContent
          title={this.props.title}
          description={this.props.description}
          children={this.props.children}
        />
      </div>
    );
  }
}

export default Card;
