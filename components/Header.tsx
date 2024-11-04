interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  // TODO: find a dynamic way to fill the entire row with logo svgs

  return (
    <div class="w-full flex flex-row justify-between items-center gap-2 px-2 py-2 h-14">
      <div class="flex flex-row gap-2 overflow-hidden">
        <img src="/logo.svg" width="32" height="32" />
        <img src="/logo.svg" width="32" height="32" />
        <img src="/logo.svg" width="32" height="32" />
        <img src="/logo.svg" width="32" height="32" />
        <img src="/logo.svg" width="32" height="32" />
        {/* <img src="/logo.svg" width="32" height="32" /> */}
      </div>

      {title && (
        <div class="flex flex-col">
          <p class="text-xs">currently exploring</p>
          <h1 class="flex-1 text-right text-lg font-bold">{title}</h1>
        </div>
      )}
    </div>
  );
}
