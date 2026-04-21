import { importFromJson } from "./actions";

type SettingsPageProps = {
  searchParams: Promise<{ created?: string; skipped?: string }>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const { created, skipped } = await searchParams;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase text-neutral-500">Export</h2>
        <div className="rounded-lg border border-neutral-200 bg-white p-4 text-sm">
          <p className="text-neutral-700">Download the full catalog as JSON.</p>
          <a
            href="/api/export"
            className="mt-3 inline-block rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-700"
          >
            Download export
          </a>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase text-neutral-500">Import</h2>
        <form
          action={importFromJson}
          encType="multipart/form-data"
          className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4 text-sm"
        >
          <p className="text-neutral-700">
            Paste a previous export. Existing books (matched by ISBN or title) are skipped.
          </p>
          <input
            name="file"
            type="file"
            accept="application/json"
            required
            className="block text-sm"
          />
          <button
            type="submit"
            className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-700"
          >
            Import
          </button>
        </form>
        {(created || skipped) && (
          <p className="text-sm text-neutral-600">
            Imported {created ?? 0} new book(s). Skipped {skipped ?? 0} duplicate(s).
          </p>
        )}
      </section>
    </div>
  );
}
