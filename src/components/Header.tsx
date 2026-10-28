import HeaderClient from "@/components/HeaderClient";
import { getDictionary, getLang } from "@/lib/i18n";

/** Site header. Reads the visitor's language on the server and hands labels to the client part. */
export default async function Header() {
  const lang = await getLang();
  return <HeaderClient labels={getDictionary(lang)} lang={lang} />;
}
