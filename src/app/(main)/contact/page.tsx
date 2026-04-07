import { ContactForm } from "@/components/forms/contact-form";

export default function ContactPage() {
  return (
    <div className="container-wrap py-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <article className="surface p-6">
          <h1 className="text-3xl font-black">Contact Deal Bazaar</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Need help with an order, payment verification, or product inquiry?
            Reach us anytime.
          </p>
          <div className="mt-6 space-y-2 text-sm">
            <p>Email: support@deal-bazaar.com</p>
            <p>Operations: operations@deal-bazaar.com</p>
            <p>Response time: Within 24 hours</p>
          </div>
        </article>
        <article className="surface p-6">
          <h2 className="text-xl font-bold">Send a message</h2>
          <div className="mt-4">
            <ContactForm />
          </div>
        </article>
      </div>
    </div>
  );
}
