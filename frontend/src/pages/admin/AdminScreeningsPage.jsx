import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardList, FilePlus2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { RiskBadge } from "@/components/screening/RiskBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { Textarea } from "@/components/ui/Textarea";
import { adminService } from "@/services/adminService";
import { formatDate } from "@/utils/format";
import { adminQuestionSchema } from "@/utils/validation";

const initialForm = {
  title: "",
  key: "",
  helperText: "",
  inputType: "choice",
  placeholder: "",
  order: 1,
  min: null,
  max: null,
  step: null,
  required: true,
  optionsText: "",
};

export function AdminScreeningsPage() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("screenings");
  const [screenings, setScreenings] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminQuestionSchema),
    defaultValues: initialForm,
  });

  const inputType = watch("inputType");

  const loadData = async () => {
    const [screeningsResponse, questionsResponse] = await Promise.all([
      adminService.getScreenings(),
      adminService.getQuestions(),
    ]);
    setScreenings(screeningsResponse.items);
    setQuestions(questionsResponse.items);
  };

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        await loadData();
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const fillForm = (question) => {
    setEditingQuestion(question);
    reset({
      title: question.title,
      key: question.key,
      helperText: question.helperText ?? "",
      inputType: question.inputType,
      placeholder: question.placeholder ?? "",
      order: question.order,
      min: question.min ?? null,
      max: question.max ?? null,
      step: question.step ?? null,
      required: Boolean(question.required),
      optionsText: (question.options ?? [])
        .map((option) => `${option.label}|${option.value}`)
        .join("\n"),
    });
    setTab("questions");
  };

  const clearForm = () => {
    setEditingQuestion(null);
    reset({
      ...initialForm,
      order: Math.max(...questions.map((item) => item.order), 0) + 1,
    });
  };

  useEffect(() => {
    if (!questions.length) return;
    clearForm();
  }, [questions.length]);

  const parseOptions = (text) =>
    text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, value] = line.split("|");
        return {
          label: label?.trim() ?? line,
          value: value?.trim() ?? label?.trim() ?? line,
        };
      });

  const onSubmit = handleSubmit(async (values) => {
    setSaving(true);
    try {
      const payload = {
        ...values,
        options:
          values.inputType === "choice" ? parseOptions(values.optionsText ?? "") : [],
        min: values.inputType === "slider" || values.inputType === "number" ? values.min : null,
        max: values.inputType === "slider" || values.inputType === "number" ? values.max : null,
        step: values.inputType === "slider" || values.inputType === "number" ? values.step : null,
      };

      if (editingQuestion) {
        await adminService.updateQuestion(editingQuestion.id, payload);
        toast.success("Pertanyaan berhasil diperbarui.");
      } else {
        await adminService.createQuestion(payload);
        toast.success("Pertanyaan baru berhasil ditambahkan.");
      }

      await loadData();
      clearForm();
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan pertanyaan.");
    } finally {
      setSaving(false);
    }
  });

  const handleDelete = async (questionId) => {
    const confirmed = window.confirm("Hapus pertanyaan ini?");
    if (!confirmed) return;

    try {
      await adminService.deleteQuestion(questionId);
      toast.success("Pertanyaan berhasil dihapus.");
      await loadData();
      clearForm();
    } catch (error) {
      toast.error(error.message || "Gagal menghapus pertanyaan.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-[560px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin Screening Data"
        title="Data hasil screening dan guided questions"
        description="Kelola hasil screening yang sudah masuk sekaligus atur pertanyaan conversation flow yang digunakan sistem."
      />

      <div className="flex gap-3">
        <Button
          variant={tab === "screenings" ? "primary" : "secondary"}
          onClick={() => setTab("screenings")}
        >
          Data Screening
        </Button>
        <Button
          variant={tab === "questions" ? "primary" : "secondary"}
          onClick={() => setTab("questions")}
        >
          Kelola Pertanyaan
        </Button>
      </div>

      {tab === "screenings" ? (
        screenings.length ? (
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left dark:divide-white/10">
                <thead className="bg-slate-50 dark:bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      User
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Tanggal
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Model
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Risiko
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                  {screenings.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-5 text-sm text-slate-700 dark:text-slate-200">
                        {item.user?.name}
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-700 dark:text-slate-200">
                        {formatDate(item.completedAt, { withTime: true })}
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-700 dark:text-slate-200">
                        {item.result?.modelUsed}
                      </td>
                      <td className="px-6 py-5">
                        <RiskBadge riskLevel={item.result?.riskLevel} />
                      </td>
                      <td className="px-6 py-5 text-sm font-semibold text-slate-950 dark:text-white">
                        {item.result?.score}/100
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <EmptyState
            icon={ClipboardList}
            title="Belum ada data screening"
            description="Data hasil screening akan tampil di sini saat user mulai menyelesaikan sesi screening."
          />
        )
      ) : (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
                Form pertanyaan
              </h2>
              <Button variant="secondary" onClick={clearForm}>
                <FilePlus2 className="size-4" />
                Pertanyaan baru
              </Button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <Input label="Pertanyaan" error={errors.title?.message} {...register("title")} />
              <Input label="Key fitur" error={errors.key?.message} {...register("key")} />
              <Input label="Helper text" {...register("helperText")} />
              <div className="grid gap-4 md:grid-cols-2">
                <Select
                  label="Input Type"
                  error={errors.inputType?.message}
                  {...register("inputType")}
                >
                  <option value="choice">choice</option>
                  <option value="slider">slider</option>
                  <option value="number">number</option>
                  <option value="textarea">textarea</option>
                </Select>
                <Input
                  label="Urutan"
                  type="number"
                  error={errors.order?.message}
                  {...register("order")}
                />
              </div>
              <Input label="Placeholder" {...register("placeholder")} />

              {(inputType === "slider" || inputType === "number") && (
                <div className="grid gap-4 md:grid-cols-3">
                  <Input label="Min" type="number" {...register("min")} />
                  <Input label="Max" type="number" {...register("max")} />
                  <Input label="Step" type="number" {...register("step")} />
                </div>
              )}

              {inputType === "choice" && (
                <Textarea
                  label="Opsi jawaban"
                  rows={5}
                  error={errors.optionsText?.message}
                  placeholder={"Format per baris: Label|value\nContoh: Nyenyak|baik"}
                  {...register("optionsText")}
                />
              )}

              <label className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <input type="checkbox" className="rounded border-slate-300" {...register("required")} />
                Wajib diisi
              </label>

              <Button type="submit" loading={saving}>
                {editingQuestion ? "Simpan Perubahan" : "Tambah Pertanyaan"}
              </Button>
            </form>
          </Card>

          <Card className="space-y-5">
            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
              Daftar pertanyaan aktif
            </h2>
            <div className="space-y-4">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className="rounded-[28px] border border-slate-200 px-5 py-5 dark:border-white/10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-slate-950 dark:text-white">
                        {question.title}
                      </p>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {question.key} • {question.inputType} • urutan {question.order}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => fillForm(question)}>
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(question.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  {question.helperText ? (
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {question.helperText}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
