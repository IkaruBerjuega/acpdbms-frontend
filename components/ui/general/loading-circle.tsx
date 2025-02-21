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
    <div
      className={`animate-spin rounded-full border-t-transparent ${color}`}
      style={{
        width: size,
        height: size,
        borderWidth: borderWidth,
      }}
    />
  );
}
