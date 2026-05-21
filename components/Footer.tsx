export function Footer() {
  return (
    <footer className="mx-auto mt-24 max-w-5xl border-t border-zinc-200 px-4 py-8 dark:border-zinc-800">
      <div className="flex flex-col items-center justify-between gap-3 text-sm text-zinc-500 dark:text-zinc-400 sm:flex-row">
        <p>
          © {new Date().getFullYear()} CutBG. Built with{' '}
          <a
            className="underline-offset-2 hover:text-brand-600 hover:underline dark:hover:text-brand-300"
            href="https://github.com/imgly/background-removal-js"
            target="_blank"
            rel="noreferrer"
          >
            @imgly/background-removal
          </a>
          .
        </p>
        <nav className="flex gap-5">
          <a className="hover:text-brand-600 dark:hover:text-brand-300" href="#how-it-works">
            How it works
          </a>
          <a className="hover:text-brand-600 dark:hover:text-brand-300" href="#privacy">
            Privacy
          </a>
        </nav>
      </div>
    </footer>
  );
}
