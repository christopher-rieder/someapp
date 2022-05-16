interface GenericFormInputProps {
  field: string;
  error?: string;
}

export default function GenericFormInput({ field, error }: GenericFormInputProps) {
  const errorId = field + '-error'
  return (
    <div>
      <label className="flex w-full flex-col gap-1">
        <span>{field}: </span>
        <input
          name={field}
          className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          aria-invalid={error ? true : undefined}
          aria-errormessage={
            error ? errorId : undefined
          }
        />
      </label>
      {error && (
        <div className="pt-1 text-red-700" id={errorId}>
          {error}
        </div>
      )}
    </div>
  )
}