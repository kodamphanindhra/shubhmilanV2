import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useI18n } from "@/hooks/use-i18n";
import { SUPPORT_FAQS } from "@/mockData/support";

export function SupportFAQ() {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.support?.faqTitle || "Frequently Asked Questions"}</CardTitle>
        <CardDescription>{t.support?.faqDescription || "Find quick answers to common questions"}</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {SUPPORT_FAQS.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
