type Props = {
  message?: string;
};

export default function FormError({ message }: Props) {
  if (!message) return null;

  return <div>{message}</div>;
}
