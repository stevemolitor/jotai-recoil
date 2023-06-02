import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  imgSrc: string;
}

export const GameHeader = ({ children, imgSrc }: Props) => (
  <div className="game-header">
    <img className="logo" src={imgSrc} />
    <span className="title">{children}</span>
  </div>
);
