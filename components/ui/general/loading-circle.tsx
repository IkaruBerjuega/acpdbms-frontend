interface LoadingCircleProps {
  size?: number;
  color?: string;
  borderWidth?: number;
}

export function LoadingCircle({
  size = 24,
  color = "border-primary",
  borderWidth = 2,
}: LoadingCircleProps) {
  return (
    <span
      className={`animate-spin rounded-full border-t-transparent border-white-primary ${color}`}
      style={{
        width: size,
        height: size,
        borderWidth: borderWidth,
      }}
    />
  );
}
