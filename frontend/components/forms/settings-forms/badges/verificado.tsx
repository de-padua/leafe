import { BadgeCheckIcon } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
function BadgeVerificado({ text }: { text: string }) {
  return (
    <div>
      <Badge
        variant="secondary"
        className="bg-blue-500 text-white dark:bg-blue-600"
      >
        <BadgeCheckIcon />
        {text}
      </Badge>
    </div>
  );
}

export default BadgeVerificado;
