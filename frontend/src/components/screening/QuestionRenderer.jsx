import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

export function QuestionRenderer({ question, onSubmit, disabled }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!question) return;

    if (question.inputType === "slider") {
      setValue(question.min ?? 1);
      return;
    }

    setValue("");
  }, [question]);

  if (!question) return null;

  const commonButton = "w-full justify-start rounded-2xl border border-slate-200 bg-white/80 px-4 py-4 text-left text-sm font-medium text-slate-700 transition hover:border-brand hover:bg-brand-soft dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10";

  const submitForm = (event) => {
    event.preventDefault();
    if (question.required && (value === "" || value === null || value === undefined)) {
      return;
    }
    onSubmit(value);
  };

  if (question.inputType === "choice") {
    return (
      <div className="space-y-4">
        <p className="text-sm leading-7 text-slate-500 dark:text-slate-400">
          {question.helperText}
        </p>
        <div className="grid gap-3">
          {question.options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={commonButton}
              onClick={() => onSubmit(option.value)}
              disabled={disabled}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (question.inputType === "slider") {
    return (
      <form onSubmit={submitForm} className="space-y-5">
        <p className="text-sm leading-7 text-slate-500 dark:text-slate-400">
          {question.helperText}
        </p>
        <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
          <div className="mb-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>1 rendah</span>
            <span>10 tinggi</span>
          </div>
          <input
            type="range"
            min={question.min}
            max={question.max}
            step={question.step}
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
            className="w-full accent-brand"
          />
          <div className="mt-4 text-center text-4xl font-semibold text-brand">
            {value}
          </div>
        </div>
        <Button type="submit" loading={disabled}>
          Lanjutkan
        </Button>
      </form>
    );
  }

  if (question.inputType === "number") {
    return (
      <form onSubmit={submitForm} className="space-y-5">
        <Input
          label={question.helperText}
          type="number"
          min={question.min}
          max={question.max}
          step={question.step}
          placeholder={question.placeholder}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <Button type="submit" loading={disabled}>
          Simpan Jawaban
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={submitForm} className="space-y-5">
      <Textarea
        label={question.helperText}
        placeholder={question.placeholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <Button type="submit" loading={disabled}>
        Simpan Catatan
      </Button>
      {!question.required ? (
        <Button
          type="button"
          variant="secondary"
          onClick={() => onSubmit(value || "Tidak ada catatan tambahan.")}
        >
          Lewati
        </Button>
      ) : null}
    </form>
  );
}
