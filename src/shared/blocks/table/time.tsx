import moment from 'moment';

export function Time({
  value,
  placeholder,
  metadata,
  className,
}: {
  value: string | Date;
  placeholder?: string;
  metadata?: {
    format?: string;
  };
  className?: string;
}) {
  if (!value) {
    if (placeholder) {
      return <div className={className}>{placeholder}</div>;
    }

    return null;
  }

  return (
    <div className={className}>
      {metadata?.format
        ? moment(value).locale('en').format(metadata?.format)
        : moment(value).locale('en').fromNow()}
    </div>
  );
}
