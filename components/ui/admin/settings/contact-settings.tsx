"use client";

import { useMemo } from "react";
import { useAdminSettings } from "@/hooks/general/use-admin-settings";
import type { ContactDetails } from "@/lib/definitions";
import { SocMedSettings } from "../contact-settings/socmed-settings";
import { ContactNoSettings } from "../contact-settings/contactno-settings";
import { EmailSettings } from "../contact-settings/email-settings";
import { Skeleton } from "../../skeleton";
import { Address } from "../contact-settings/address-settings";

export function ContactSettings() {
  const { contactDetailsQuery } = useAdminSettings();
  const { data: contactDetailsData, error, isLoading } = contactDetailsQuery;

  // Ensure data is properly typed and memoized
  const contactDetails: ContactDetails[] = useMemo(
    () => contactDetailsData?.contact_details || [],
    [contactDetailsData]
  );

  const contactNumbers = useMemo(
    () => contactDetails.filter((contact) => contact.type === "contact_number"),
    [contactDetails]
  );
  const email = useMemo(
    () => contactDetails.filter((contact) => contact.type === "email"),
    [contactDetails]
  );
  const facebook = useMemo(
    () => contactDetails.filter((contact) => contact.type === "facebook"),
    [contactDetails]
  );
  const instagram = useMemo(
    () => contactDetails.filter((contact) => contact.type === "instagram"),
    [contactDetails]
  );
  const linkedIn = useMemo(
    () => contactDetails.filter((contact) => contact.type === "linkedin"),
    [contactDetails]
  );

  const address = useMemo(
    () => contactDetails.filter((contact) => contact.type === "address"),
    [contactDetails]
  );

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <Address address={address} />
      <ContactNoSettings contactNumbers={contactNumbers} />
      <EmailSettings email={email} />
      <SocMedSettings
        facebook={facebook}
        instagram={instagram}
        linkedIn={linkedIn}
      />
    </div>
  );
}
