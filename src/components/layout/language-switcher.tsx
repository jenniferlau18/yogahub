"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function toggle() {
    const next = locale === "en" ? "zh" : "en";
    router.replace(pathname, { locale: next });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="text-xs font-medium uppercase px-2"
    >
      {locale === "en" ? "中文" : "EN"}
    </Button>
  );
}
