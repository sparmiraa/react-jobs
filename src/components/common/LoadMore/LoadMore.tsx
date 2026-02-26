import styles from "./LoadMore.module.scss";

type Props = {
  total: number;
  limit: number;
  loaded: number; 
  loading?: boolean; 
  loadingMore?: boolean;
  onLoadMore: () => void;
  nounForms?: [string, string, string]; 
};

function pluralRu(n: number, forms: [string, string, string]) {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (last > 1 && last < 5) return forms[1];
  if (last === 1) return forms[0];
  return forms[2];
}

export default function LoadMore({
  total,
  limit,
  loaded,
  loading = false,
  loadingMore = false,
  onLoadMore,
  nounForms = ["элемент", "элемента", "элементов"],
}: Props) {
  const canLoadMore = loaded < total;
  const remaining = Math.max(0, total - loaded);
  const showCount = Math.min(limit, remaining);

  const btnText = loadingMore
    ? "Загружаем…"
    : canLoadMore
      ? `Показать еще ${showCount} ${pluralRu(showCount, nounForms)} ↓`
      : "Больше ничего нет";

  return (
    <div className={styles.loadMoreContainer}>
      <button
        type="button"
        className={styles.btnLoadMore}
        onClick={onLoadMore}
        disabled={!canLoadMore || loadingMore || loading}
      >
        {btnText}
      </button>
    </div>
  );
}