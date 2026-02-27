export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="container-x py-8 text-sm text-zinc-600">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} ApkaMushroom</div>
         
        </div>
      </div>
    </footer>
  );
}
