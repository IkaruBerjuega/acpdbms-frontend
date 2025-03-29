'use client';
import { useMemo } from 'react';
import {
  useAdminSettings,
  useSettingsActions,
} from '@/hooks/general/use-admin-settings';
import type { ContactDetails, DynamicContactSchema } from '@/lib/definitions';
import { SocMedSettings } from './contact-settings/socmed-settings';
import { ContactNoSettings } from './contact-settings/contactno-settings';
import { EmailSettings } from './contact-settings/email-settings';
import { Skeleton } from '../skeleton';

interface DeleteContactPayload {
  ids: number[];
}

export function ContactSettings() {
  const { contactDetailsQuery } = useAdminSettings<DynamicContactSchema>();
  const { data: contactDetailsData, error, isLoading } = contactDetailsQuery;

  const { storeContactDetails, deleteContactDetail } = useSettingsActions<
    { contact_details: ContactDetails[] } | DeleteContactPayload
  >();

  // Ensure data is properly typed and memoized
  const contactDetails: ContactDetails[] = useMemo(
    () => contactDetailsData?.contact_details || [],
    [contactDetailsData]
  );

  const contactNumbers = useMemo(
    () => contactDetails.filter((contact) => contact.type === 'contact_number'),
    [contactDetails]
  );
  const email = useMemo(
    () => contactDetails.filter((contact) => contact.type === 'email'),
    [contactDetails]
  );
  const facebook = useMemo(
    () => contactDetails.filter((contact) => contact.type === 'facebook'),
    [contactDetails]
  );
  const instagram = useMemo(
    () => contactDetails.filter((contact) => contact.type === 'instagram'),
    [contactDetails]
  );
  const linkedIn = useMemo(
    () => contactDetails.filter((contact) => contact.type === 'linkedin'),
    [contactDetails]
  );

  if (isLoading) {
    return (
      <div className='grid gap-6'>
        <Skeleton className='h-32 w-full' />
        <Skeleton className='h-32 w-full' />
        <Skeleton className='h-32 w-full' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive'>
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className='grid gap-6'>
      <ContactNoSettings
        storeContactDetails={storeContactDetails}
        deleteContactDetail={deleteContactDetail}
        contactNumbers={contactNumbers}
      />
      <EmailSettings storeContactDetails={storeContactDetails} email={email} />
      <SocMedSettings
        storeContactDetails={storeContactDetails}
        facebook={facebook}
        instagram={instagram}
        linkedIn={linkedIn}
      />
    </div>
  );
}
