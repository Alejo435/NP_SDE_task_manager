interface Props {
  title: string;
  detail: string;
  onRetry: () => void;
}

export default function ErrorState({ title, detail, onRetry }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="font-semibold">{title}</p>
      <p className="max-w-sm text-sm text-muted">{detail}</p>
      <button
        onClick={onRetry}
        className="rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-ink hover:brightness-110"
      >
        Try again
      </button>
    </div>
  );
}
