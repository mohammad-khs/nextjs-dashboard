import Form from "@/app/ui/invoices/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import {
  fetchInvoiceById,
  fetchCustomers,
  fetchCustomerById,
} from "@/app/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const id = params.id;
  const invoice = await fetchInvoiceById(id);
  const customer = await fetchCustomerById(invoice.customer_id);

  if (!invoice) {
    return {
      description: "error",
      title: "Error",
    };
  }
  return {
    title: customer[0].name,
    description: `this is ${customer[0].name} invoice`,
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  if (!invoice) {
    return notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: "Edit Invoice",
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}
