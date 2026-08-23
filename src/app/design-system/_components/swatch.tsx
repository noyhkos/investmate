interface SwatchProps {
  token: string;
  role: string;
  light: string;
  dark: string;
  note?: string;
}

/** Both modes are shown side by side because neither derives from the other. */
export function SwatchRow({ token, role, light, dark, note }: SwatchProps) {
  return (
    <tr className="border-rule border-b last:border-b-0">
      <td className="py-2 pr-3 align-top">
        <code className="text-foreground text-[0.6875rem]">{token}</code>
        <div className="text-muted-foreground mt-0.5 text-[0.6875rem]">{role}</div>
      </td>
      <td className="py-2 pr-3 align-top">
        <div className="flex items-center gap-2">
          <span
            className="border-border size-5 shrink-0 rounded-[2px] border"
            style={{ backgroundColor: light }}
            aria-hidden
          />
          <code className="text-text-secondary text-[0.6875rem] tabular-nums">{light}</code>
        </div>
      </td>
      <td className="py-2 pr-3 align-top">
        <div className="flex items-center gap-2">
          <span
            className="border-border size-5 shrink-0 rounded-[2px] border"
            style={{ backgroundColor: dark }}
            aria-hidden
          />
          <code className="text-text-secondary text-[0.6875rem] tabular-nums">{dark}</code>
        </div>
      </td>
      <td className="text-muted-foreground py-2 align-top text-[0.6875rem] leading-relaxed">
        {note}
      </td>
    </tr>
  );
}

export function SwatchTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[36rem] text-left">
        <thead>
          <tr className="text-muted-foreground border-rule border-b text-[0.6875rem]">
            <th className="pb-2 font-normal">토큰</th>
            <th className="pb-2 font-normal">Light</th>
            <th className="pb-2 font-normal">Dark</th>
            <th className="pb-2 font-normal">비고</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
