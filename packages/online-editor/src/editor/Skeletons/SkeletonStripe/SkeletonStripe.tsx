import * as React from "react";
import "./SkeletonStripe.scss";
import { useMemo } from "react";

interface SkeletonStripeProps {
  customStyle?: React.CSSProperties;
  isInline?: boolean;
  size?: "sm" | "md" | "lg";
}

const SkeletonStripe = (props: SkeletonStripeProps) => {
  const { isInline = false, size = "sm", customStyle } = props;
  const stripeStyle = useMemo(() => customStyle || {}, [customStyle]);
  let cssClasses = "skeleton__stripe";

  if (isInline) {
    cssClasses += " skeleton__stripe--inline";
  }
  if (size !== "sm") {
    cssClasses += ` skeleton__stripe--${size}`;
  }

  return <span className={cssClasses} style={stripeStyle} />;
};

export default SkeletonStripe;
