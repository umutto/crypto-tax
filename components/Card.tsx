import React, { ReactNode } from "react";
import Link from "next/link";

import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

import styles from "../styles/home.module.scss";

const CardContent = (props: {
  title: string;
  description: string | ReactNode;
  children?: ReactNode;
  icon?: FontAwesomeIconProps;
}) => {
  return (
    <div>
      <h2>
        {" "}
        {props.icon ? (
          <FontAwesomeIcon
            icon={props.icon.icon}
            fixedWidth
            className="mr-2 text-green-500"
          />
        ) : null}
        {props.title}
      </h2>
      <p>{props.description}</p>
      {props.children}
    </div>
  );
};

class Card extends React.Component<{
  title: string;
  description: string | ReactNode;
  icon?: FontAwesomeIconProps;
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
          <CardContent
            title={this.props.title}
            description={this.props.description}
            icon={this.props.icon}
          />
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
