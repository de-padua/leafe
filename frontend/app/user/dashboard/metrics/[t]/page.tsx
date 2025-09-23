import React from "react";
import { z } from "zod";
function page() {


  const configSchema = z.object({
    contactform: z.enum(["whatsapp","email"]),
    hidevalue : z.boolean().default(false),
    hideAdress:z.boolean().default(false),
    autoExpire:z.enum(["30","60","90"])
  });


  return <div></div>;
}

export default page;
